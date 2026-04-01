import { copyProperties, Properties } from "@quick-threejs/utils";
import { Lifecycle, scoped } from "tsyringe";
import { AudioLoader, ImageBitmapLoader, Loader, LoadingManager } from "three";
import { FontLoader } from "three/examples/jsm/Addons";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import {
	type LoadedResourcePayload,
	type LoaderResource,
	type LoaderSource
} from "@/common";

@scoped(Lifecycle.ContainerScoped)
export class LoaderService {
	public static readonly DEFAULT_DRACO_DECODER_PATH =
		"https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

	public readonly loadingManager = new LoadingManager();
	public readonly loaders: {
		audio?: AudioLoader;
		draco?: DRACOLoader;
		gltf?: GLTFLoader;
		image?: ImageBitmapLoader;
		video?: LoaderService["videoLoader"];
		font?: FontLoader;
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
		this.loaders.draco = new DRACOLoader(this.loadingManager);
		this.loaders.audio = new AudioLoader(this.loadingManager);
		this.loaders.font = new FontLoader(this.loadingManager);
		this.loaders.gltf = new GLTFLoader(this.loadingManager);
		this.loaders.image = new ImageBitmapLoader(this.loadingManager);
		this.loaders.video = this.videoLoader;
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
		if (!this.loaders.draco) return;

		this.loaders.draco.setDecoderPath(
			dracoDecoderPath ?? LoaderService.DEFAULT_DRACO_DECODER_PATH
		);
		this.loaders.gltf?.setDRACOLoader(this.loaders.draco);
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

	public launchLoad(
		onLoad?: (source: LoaderSource, resource?: LoaderResource) => unknown
	) {
		const firstSource = this.sources[0];
		if (!firstSource) return;

		onLoad?.(firstSource);

		let loaderConfig: Omit<Properties<Loader>, "manager"> | undefined;
		let dracoDecoderConfig:
			| {
					decoderPath: string;
					decoderConfig: any;
					workerLimit: number;
			  }
			| undefined;

		const applyDynamicConfig = (source: LoaderSource) => {
			const loader = this.loaders[source.type];
			const options = source.options || {};

			if (!(loader instanceof Loader)) return;

			loaderConfig = copyProperties(loader, [
				"crossOrigin",
				"requestHeader",
				"resourcePath",
				"path",
				"withCredentials"
			]);

			if (options.crossOrigin) loader.setCrossOrigin(options.crossOrigin);
			if (options.requestHeader) loader.setRequestHeader(options.requestHeader);
			if (options.resourcePath) loader.setResourcePath(options.resourcePath);
			if (options.path) loader.setPath(options.path);
			if (options.withCredentials)
				loader.setWithCredentials(options.withCredentials);
		};

		const resetDynamicConfig = (source: LoaderSource) => {
			const loader = this.loaders[source.type];
			const options = source.options || {};

			if (!(loader instanceof Loader) || !loaderConfig) return;

			if (options.crossOrigin) loader.setCrossOrigin(loaderConfig.crossOrigin);
			if (options.requestHeader)
				loader.setRequestHeader(loaderConfig.requestHeader);
			if (options.resourcePath)
				loader.setResourcePath(loaderConfig.resourcePath);
			if (options.path) loader.setPath(loaderConfig.path);
			if (options.withCredentials)
				loader.setWithCredentials(loaderConfig.withCredentials);
		};

		const applyDynamicDracoDecoderConfig = (source: LoaderSource) => {
			const loader = this.loaders.draco;
			const options = source.options?.draco || {};

			if (!loader || !this.loaders[source.type] || source.type !== "gltf")
				return;

			dracoDecoderConfig = copyProperties(loader as any, [
				"decoderPath",
				"decoderConfig",
				"workerLimit"
			]);

			if (options.path) loader.setDecoderPath(options.path);
			if (options.config) loader.setDecoderConfig(options.config);
			if (options.workerLimit) loader.setWorkerLimit(options.workerLimit);
		};

		const resetDynamicDracoDecoderConfig = (source: LoaderSource) => {
			const loader = this.loaders.draco;
			const options = source.options?.draco || {};

			if (
				!loader ||
				!dracoDecoderConfig ||
				source.type !== "gltf" ||
				!this.loaders[source.type]
			)
				return;

			if (options.path) loader.setDecoderPath(dracoDecoderConfig.decoderPath);
			if (options.config)
				loader.setDecoderConfig(dracoDecoderConfig.decoderConfig);
			if (options.workerLimit)
				loader.setWorkerLimit(dracoDecoderConfig.workerLimit);
		};

		for (const source of this.sources) {
			if (this.loadedResources[source.name] || typeof source.path !== "string")
				continue;

			applyDynamicConfig(source);
			applyDynamicDracoDecoderConfig(source);

			if (source.type === "gltf")
				this.loaders.gltf?.load(source.path, (model) =>
					onLoad?.(source, model)
				);

			if (source.type === "audio")
				this.loaders.audio?.load(source.path, (audioBuffer) =>
					onLoad?.(source, audioBuffer)
				);

			if (source.type === "image" && this.loaders.image) {
				this.loaders.image.load(source.path, async (loaderImage) => {
					let image = loaderImage;

					if (source.options?.imageBitmap) {
						const options = {
							...this.loaders.image?.options,
							...source.options?.imageBitmap
						};
						image = await createImageBitmap(image, options);
						loaderImage.close();
					}

					onLoad?.(source, image);
				});
			}

			if (source.type === "video")
				this.loaders.video?.load(source.path, (videoElement) =>
					onLoad?.(source, videoElement)
				);

			if (source.type === "font")
				this.loaders.font?.load(source.path, (font) => onLoad?.(source, font));

			resetDynamicConfig(source);
			resetDynamicDracoDecoderConfig(source);
		}
	}

	dispose() {}
}
