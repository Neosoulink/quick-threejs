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
} from "../../common/interfaces/resource.interface";

@scoped(Lifecycle.ResolutionScoped)
export class LoaderComponent {
	public readonly loadingManager = new LoadingManager();
	public readonly loaders: {
		dracoLoader?: DRACOLoader;
		gltfLoader?: GLTFLoader;
		textureLoader?: ImageBitmapLoader;
		cubeTextureLoader?: CubeTextureLoader;
		audioLoader?: AudioLoader;
		videoLoader?: LoaderComponent["videoLoader"];
	} = {};

	public resources: Resource[] = [];
	public items: { [name: Resource["name"]]: LoadedResourceItem } = {};
	public toLoad = 0;
	public loaded = 0;

	private get videoLoader() {
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

	private _setLoaders() {
		this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this.loaders.textureLoader = new ImageBitmapLoader(this.loadingManager);
		this.loaders.cubeTextureLoader = new CubeTextureLoader(this.loadingManager);
		this.loaders.audioLoader = new AudioLoader(this.loadingManager);
		this.loaders.videoLoader = this.videoLoader;
	}

	public setResources(resources: Resource[]) {
		this.resources = resources;
		this.toLoad = this.resources.length;
		this.loaded = 0;
	}

	public init(resources: Resource[] = []) {
		this.resources = resources;
		this._setLoaders();
	}
}
