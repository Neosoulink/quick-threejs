import { Lifecycle, scoped } from "tsyringe";
import {
	AudioLoader,
	CubeTextureLoader,
	ImageBitmapLoader,
	LoadingManager,
	VideoTexture
} from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import {
	LoadedResourceItem,
	Resource
} from "../common/interfaces/resource.interface";

@scoped(Lifecycle.ResolutionScoped)
export class LoaderComponent {
	private readonly _loadingManager = new LoadingManager();
	private readonly _loaders: {
		dracoLoader?: DRACOLoader;
		gltfLoader?: GLTFLoader;
		textureLoader?: ImageBitmapLoader;
		cubeTextureLoader?: CubeTextureLoader;
		audioLoader?: AudioLoader;
		videoLoader?: LoaderComponent["videoLoader"];
	} = {};

	private _resources: Resource[] = [];
	private _items: { [name: Resource["name"]]: LoadedResourceItem } = {};
	private _toLoad = 0;
	private _loaded = 0;

	private _setLoaders() {
		this._loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this._loaders.textureLoader = new ImageBitmapLoader(this.loadingManager);
		this._loaders.cubeTextureLoader = new CubeTextureLoader(
			this.loadingManager
		);
		this._loaders.audioLoader = new AudioLoader(this.loadingManager);
		this._loaders.videoLoader = this.videoLoader;
	}

	public get loadingManager() {
		return this._loadingManager;
	}

	public get loaders() {
		return this._loaders;
	}

	public get videoLoader() {
		return {
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
	}

	public get resources() {
		return this._resources;
	}

	public get items() {
		return this._items;
	}

	public get toLoad() {
		return this._toLoad;
	}

	public get loaded() {
		return this._loaded;
	}

	public set resources(resources: Resource[]) {
		this._resources = resources;
		this._toLoad = this.resources.length;
		this._loaded = 0;
	}

	public set toLoad(val: number) {
		this._toLoad = isNaN(+val) ? 0 : +val;
	}

	public set loaded(val: number) {
		this._loaded = isNaN(+val) ? 0 : +val;
	}

	public init(resources: Resource[] = []) {
		this.resources = resources;

		this._setLoaders();
	}
}
