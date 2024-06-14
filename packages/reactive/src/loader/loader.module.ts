import "reflect-metadata";

import { container, Lifecycle, scoped } from "tsyringe";
import { expose } from "threads/worker";
import { Observable, Subject } from "threads/observable";
import {
	AudioLoader,
	CanvasTexture,
	CubeTexture,
	CubeTextureLoader,
	ImageBitmapLoader,
	LoadingManager,
	Texture,
	VideoTexture
} from "three";
import {
	type GLTF,
	GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import {
	ExposedWorkerThreadModule,
	WorkerThreadModule
} from "@quick-threejs/utils/dist/types/worker";
import { Module } from "../common/interfaces/module.interface";

export type ExposedLoaderModule = ExposedWorkerThreadModule<LoaderModule>;

export type LoadedItem =
	| GLTF
	| Texture
	| CubeTexture
	| VideoTexture
	| AudioBuffer;

export interface Source {
	name: string;
	type: "cubeTexture" | "texture" | "gltfModel" | "video" | "audio";
	path: string | string[];
}

@scoped(Lifecycle.ResolutionScoped)
export class LoaderModule implements Module, WorkerThreadModule {
	private readonly _lifecycleSubject = new Subject();
	private readonly _progressSubject = new Subject();

	private sources: Source[] = [];
	private items: { [name: Source["name"]]: LoadedItem } = {};
	private toLoad = 0;
	private loaded = 0;
	private loaders: {
		dracoLoader?: DRACOLoader;
		gltfLoader?: GLTFLoader;
		textureLoader?: ImageBitmapLoader;
		cubeTextureLoader?: CubeTextureLoader;
		audioLoader?: AudioLoader;
	} = {};
	private loadingManager = new LoadingManager();

	constructor() {
		self.onmessage = (event: MessageEvent<{ sources?: Source[] }>) => {
			const sources = event?.data?.sources;
			if (sources) this.init(sources);
		};
	}

	private _videoLoader = {
		load: (url: string, callback: (texture: VideoTexture) => unknown) => {
			let element: HTMLVideoElement | undefined =
				document.createElement("video");
			element.muted = true;
			element.loop = true;
			element.controls = false;
			element.playsInline = true;
			element.src = url;
			element.autoplay = true;

			const oncanplaythrough = () => {
				if (!element) return;

				element.play();
				const texture = new VideoTexture(element);
				const textureDispose = texture.dispose.bind(texture);
				texture.dispose = () => {
					texture.userData.element = undefined;
					element?.remove();
					element = undefined;
					textureDispose();
				};
				callback(texture);
				texture.userData.element = element;

				element.removeEventListener("canplaythrough", oncanplaythrough);
			};
			element.addEventListener("canplaythrough", oncanplaythrough);
		}
	};

	private _setLoaders() {
		this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this.loaders.textureLoader = new ImageBitmapLoader(this.loadingManager);
		this.loaders.cubeTextureLoader = new CubeTextureLoader(this.loadingManager);
		this.loaders.audioLoader = new AudioLoader(this.loadingManager);
	}

	private _handleLoadedSource(source: Source, file: LoadedItem) {
		this.items[source.name] = file;
		this.loaded++;
		this._progressSubject.next({
			file,
			source,
			loaded: this.loaded,
			toLoad: this.toLoad
		});

		if (this.loaded === this.toLoad) {
			this._progressSubject.next({
				file,
				source,
				loaded: this.loaded,
				toLoad: this.toLoad,
				completed: true
			});
			this._progressSubject.complete();
			this._lifecycleSubject.complete();
		}
	}

	public setDracoLoader(dracoDecoderPath: string, linkWithGltfLoader = true) {
		this.loaders.dracoLoader = new DRACOLoader(this.loadingManager);
		this.loaders.dracoLoader.setDecoderPath(dracoDecoderPath);

		if (linkWithGltfLoader && this.loaders.gltfLoader)
			this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
	}

	public startLoading() {
		this._progressSubject.next({
			source: this.sources[0],
			loaded: this.loaded,
			toLoad: this.toLoad
		});

		for (const source of this.sources) {
			if (!this.items[source.name]) {
				if (source.type === "gltfModel" && typeof source.path === "string") {
					this.loaders.gltfLoader?.load(source.path, (model) =>
						this._handleLoadedSource(source, model)
					);
				}
				if (source.type === "texture" && typeof source.path === "string") {
					this.loaders.textureLoader?.load(source.path, (texture) => {
						this._handleLoadedSource(source, new CanvasTexture(texture));
					});
				}
				if (source.type === "cubeTexture" && typeof source.path === "object") {
					this.loaders.cubeTextureLoader?.load(source.path, (texture) =>
						this._handleLoadedSource(source, texture)
					);
				}
				if (source.type === "video" && typeof source.path === "string") {
					this._videoLoader.load(source.path, (texture) =>
						this._handleLoadedSource(source, texture)
					);
				}
				if (source.type === "audio" && typeof source.path === "string") {
					this.loaders.audioLoader?.load(source.path, (audioBuffer) => {
						this._handleLoadedSource(source, audioBuffer);
					});
				}
			}
		}
	}

	public lifecycle() {
		return Observable.from(this._lifecycleSubject);
	}

	public progress() {
		return Observable.from(this._progressSubject);
	}

	public init(sources: Source[] = []) {
		this.sources = sources;
		this.toLoad = this.sources.length;
		this.loaded = 0;

		this._setLoaders();

		return this.toLoad;
	}
}

const loaderModule = container.resolve(LoaderModule);

expose({
	startLoading: loaderModule.startLoading.bind(loaderModule),
	setDracoLoader: loaderModule.setDracoLoader.bind(loaderModule),
	lifecycle: loaderModule.lifecycle.bind(loaderModule),
	progress: loaderModule.progress.bind(loaderModule),
	init: () => {}
} satisfies ExposedLoaderModule);
