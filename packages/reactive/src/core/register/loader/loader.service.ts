import { singleton } from "tsyringe";
import { AudioLoader, ImageBitmapLoader, LoadingManager } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import {
	LoadedResourcePayload,
	LoaderResource,
	LoaderSource
} from "../../../common/interfaces/loader.interface";

@singleton()
export class LoaderService {
	public readonly loadingManager = new LoadingManager();
	public readonly loaders: {
		audioLoader?: AudioLoader;
		dracoLoader?: DRACOLoader;
		gltfLoader?: GLTFLoader;
		imageLoader?: ImageBitmapLoader;
		videoLoader?: LoaderService["videoLoader"];
	} = {};

	public sources: LoaderSource[] = [];
	public loadedResources: Record<string, LoaderResource> = {};
	public toLoadCount = 0;
	public loadedCount = 0;

	/** @description The video loader. based on {@link HTMLVideoElement}. */
	private get videoLoader() {
		return {
			load: (url: string, callback: (texture: HTMLVideoElement) => unknown) => {
				const video: HTMLVideoElement | undefined =
					document.createElement("video");
				video.muted = true;
				video.loop = true;
				video.crossOrigin = "anonymous";
				video.controls = false;
				video.playsInline = true;
				video.src = url;
				video.autoplay = true;

				const onCanPlayThrough = async () => {
					callback(video);
					video.removeEventListener("canplaythrough", onCanPlayThrough);
				};
				video.addEventListener("canplaythrough", onCanPlayThrough);
			}
		};
	}

	private _initLoaders() {
		this.loaders.dracoLoader = new DRACOLoader(this.loadingManager);
		this.loaders.audioLoader = new AudioLoader(this.loadingManager);
		this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this.loaders.imageLoader = new ImageBitmapLoader(this.loadingManager);
		this.loaders.videoLoader = this.videoLoader;
	}

	public _initSources(sources: LoaderSource[]) {
		this.sources = sources;
		this.toLoadCount = this.sources.length;
		this.loadedCount = 0;
	}

	public init(sources: LoaderSource[] = []) {
		this._initLoaders();
		this._initSources(sources);
	}

	public setDracoDecoder(dracoDecoderPath?: string) {
		if (!this.loaders.dracoLoader) return;

		this.loaders.dracoLoader.setDecoderPath(
			dracoDecoderPath ??
				"https://www.gstatic.com/draco/versioned/decoders/1.4.3/"
		);
		this.loaders.gltfLoader?.setDRACOLoader(this.loaders.dracoLoader);
	}

	public handleLoad({
		source,
		resource,
		toLoadCount,
		loadedCount
	}: LoadedResourcePayload) {
		if (!resource) return;

		this.loadedResources[source.name] = resource;
		this.loadedCount = loadedCount;
		this.toLoadCount = toLoadCount;
	}

	public load(
		onLoad?: (source: LoaderSource, resource?: LoaderResource) => unknown
	) {
		const firstSource = this.sources[0];
		if (!firstSource) return;

		onLoad?.(firstSource);

		for (const source of this.sources) {
			if (this.loadedResources[source.name] || typeof source.path !== "string")
				return;

			if (source.type === "gltf")
				this.loaders.gltfLoader?.load(source.path, (model) =>
					onLoad?.(source, model)
				);

			if (source.type === "audio")
				this.loaders.audioLoader?.load(source.path, (audioBuffer) => {
					onLoad?.(source, audioBuffer);
				});

			if (source.type === "image")
				this.loaders.imageLoader?.load(source.path, (image) => {
					onLoad?.(source, image);
				});

			if (source.type === "video")
				this.loaders.videoLoader?.load(source.path, (videoElement) =>
					onLoad?.(source, videoElement)
				);
		}
	}
}
