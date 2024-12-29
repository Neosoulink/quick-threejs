import { singleton } from "tsyringe";
import {
	AudioLoader,
	CubeTextureLoader,
	ImageBitmapLoader,
	LoadingManager,
	VideoTexture
} from "three";
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
		dracoLoader?: DRACOLoader;
		gltfLoader?: GLTFLoader;
		textureLoader?: ImageBitmapLoader;
		cubeTextureLoader?: CubeTextureLoader;
		audioLoader?: AudioLoader;
		videoLoader?: LoaderService["videoLoader"];
	} = {};

	public sources: LoaderSource[] = [];
	public loadedResources: Record<string, LoaderResource> = {};
	public toLoadCount = 0;
	public loadedCount = 0;

	/** @description The video loader. based on {@link HTMLVideoElement}. */
	private get videoLoader() {
		return {
			load: (url: string, callback: (texture: VideoTexture) => unknown) => {
				const element: HTMLVideoElement | undefined =
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
						(texture.image as HTMLVideoElement | undefined)?.remove();
						textureDispose();
					};
					callback(texture);

					element.removeEventListener("canplaythrough", oncanplaythrough);
				};
				element.addEventListener("canplaythrough", oncanplaythrough);
			}
		};
	}

	private _initLoaders() {
		this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this.loaders.textureLoader = new ImageBitmapLoader(this.loadingManager);
		this.loaders.cubeTextureLoader = new CubeTextureLoader(this.loadingManager);
		this.loaders.audioLoader = new AudioLoader(this.loadingManager);
		this.loaders.dracoLoader = new DRACOLoader(this.loadingManager);
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
}
