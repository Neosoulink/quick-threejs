import * as THREE from "three";
import EventEmitter from "events";
import {
	type GLTF,
	GLTFLoader,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import ThreeApp from "..";

import { events } from "../static";
import { disposeMaterial } from "./helpers";

export type LoadedItem =
	| GLTF
	| THREE.Texture
	| THREE.CubeTexture
	| THREE.VideoTexture
	| AudioBuffer;

export interface Source {
	name: string;
	type: "cubeTexture" | "texture" | "gltfModel" | "video" | "audio";
	path: string | string[];
}

export default class Resources extends EventEmitter {
	app: ThreeApp;
	sources: Source[] = [];
	items: { [name: Source["name"]]: LoadedItem } = {};
	toLoad = 0;
	loaded = 0;
	loaders: {
		dracoLoader?: DRACOLoader;
		gltfLoader?: GLTFLoader;
		textureLoader?: THREE.TextureLoader;
		cubeTextureLoader?: THREE.CubeTextureLoader;
		audioLoader?: THREE.AudioLoader;
	} = {};
	loadingManager = new THREE.LoadingManager();

	private _videoLoader = {
		load: (url: string, callback: (texture: THREE.VideoTexture) => unknown) => {
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
				const texture = new THREE.VideoTexture(element);
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
		},
	};

	constructor(sources?: Source[]) {
		super();

		this.app = new ThreeApp();

		if (sources) {
			this.setSources(sources);
		}
		this.setLoaders();
		this.emit(events.CONSTRUCTED);
	}

	setSources(sources: Source[] = []) {
		this.sources = sources;
		this.toLoad = this.sources.length;
		this.loaded = 0;

		return this.toLoad;
	}

	addSource(source: Source) {
		this.sources.push(source);
		this.toLoad = this.sources.length;
		return this.toLoad;
	}

	getSource(sourceName: string): Source | undefined {
		return this.sources.filter((source) => source.name === sourceName)[0];
	}

	removeSource(sourceName: string) {
		this.sources = this.sources.filter((source) => source.name === sourceName);
		this.toLoad = this.sources.length;

		if (this.loaded > this.toLoad) this.loaded = this.toLoad - 1;

		return this.toLoad;
	}

	setLoaders() {
		this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager);
		this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(
			this.loadingManager,
		);
		this.loaders.audioLoader = new THREE.AudioLoader(this.loadingManager);
	}

	setDracoLoader(dracoDecoderPath: string, linkWithGltfLoader = true) {
		this.loaders.dracoLoader = new DRACOLoader(this.loadingManager);
		this.loaders.dracoLoader.setDecoderPath(dracoDecoderPath);

		if (linkWithGltfLoader && this.loaders.gltfLoader) {
			this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
		}
	}

	startLoading() {
		this.emit(events.STARTED, this.sources[0], this.loaded, this.toLoad);

		for (const source of this.sources) {
			if (!this.items[source.name]) {
				if (source.type === "gltfModel" && typeof source.path === "string") {
					this.loaders.gltfLoader?.load(source.path, (model) =>
						this.sourceLoaded(source, model),
					);
				}
				if (source.type === "texture" && typeof source.path === "string") {
					this.loaders.textureLoader?.load(source.path, (texture) =>
						this.sourceLoaded(source, texture),
					);
				}
				if (source.type === "cubeTexture" && typeof source.path === "object") {
					this.loaders.cubeTextureLoader?.load(source.path, (texture) =>
						this.sourceLoaded(source, texture),
					);
				}
				if (source.type === "video" && typeof source.path === "string") {
					this._videoLoader.load(source.path, (texture) =>
						this.sourceLoaded(source, texture),
					);
				}
				if (source.type === "audio" && typeof source.path === "string") {
					this.loaders.audioLoader?.load(source.path, (audioBuffer) => {
						this.sourceLoaded(source, audioBuffer);
					});
				}
			}
		}
	}

	sourceLoaded(source: Source, file: LoadedItem) {
		this.items[source.name] = file;
		this.loaded++;
		this.emit(events.PROGRESSED, this.loaded, this.toLoad, source, file);

		if (this.loaded === this.toLoad) {
			this.emit(events.LOADED, source.path, this.loaded, this.toLoad);
		}
	}

	destruct() {
		const keys = Object.keys(this.items);

		for (let i = 0; i < keys.length; i++) {
			const item = this.items[keys[i]];
			if (item instanceof THREE.Texture) item.dispose();

			if ((item as GLTF | undefined)?.scene?.traverse) {
				(item as GLTF).scene.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.geometry.dispose();

						if (Array.isArray(child.material)) {
							child.material.forEach((material) => {
								disposeMaterial(material);
							});
						} else {
							disposeMaterial(child.material);
						}
					}
				});
			}
		}

		this.loaders.dracoLoader?.dispose();
		this.loadingManager.removeHandler(/onStart|onError|onProgress|onLoad/);
		this.setSources();
		this.loaders = {};
		this.items = {};

		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}
}
