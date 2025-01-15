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
			load: (url: string, callback: (texture: ImageBitmap[]) => unknown) => {
				const element: HTMLVideoElement | undefined =
					document.createElement("video");
				element.muted = true;
				element.loop = true;
				element.crossOrigin = "anonymous";
				element.controls = false;
				element.playsInline = true;
				element.src = url;
				element.autoplay = true;

				async function extractVideoFrames(video: HTMLVideoElement) {
					const offscreenCanvas = new OffscreenCanvas(
						video.videoWidth,
						video.videoHeight
					);
					const ctx = offscreenCanvas.getContext("2d");
					const frameRate = 30; // Target frame rate for extraction
					const frames: ImageBitmap[] = [];

					console.log("Extracting frames from video");

					return new Promise<ImageBitmap[]>((resolve) => {
						video.currentTime = 0;

						while (video.currentTime < video.duration) {
							ctx?.drawImage(
								video,
								0,
								0,
								offscreenCanvas.width,
								offscreenCanvas.height
							);
							const bitmap = offscreenCanvas.transferToImageBitmap();
							frames.push(bitmap);

							if (video.currentTime < video.duration) {
								video.currentTime += 1 / frameRate; // Move to the next frame
							}
						}
						resolve(frames);

						video.onerror = (error) => {
							console.error("Error while extracting frames:", error);
						};

						// Start extraction
						video.currentTime = 0;
					});
				}

				const onLoadedData = async () => {
					if (!element) return;
					const frames = await extractVideoFrames(element);

					console.log("Video loaded", frames);

					callback(frames);

					element.removeEventListener("loadeddata", onLoadedData);
				};
				element.addEventListener("loadeddata", onLoadedData);
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
				this.loaders.videoLoader?.load(source.path, (texture) =>
					onLoad?.(source, texture)
				);
		}
	}
}
