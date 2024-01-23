import * as THREE from "three";
import EventEmitter from "events";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// CLASSES
import ThreeApp from "..";

// LOCAL TYPES
export type LoadedItemType =
	| GLTF
	| THREE.Texture
	| THREE.CubeTexture
	| HTMLVideoElement;

export interface SourceType {
	name: string;
	type: "cubeTexture" | "texture" | "gltfModel" | "video";
	path: string | string[];
}

export default class Resources extends EventEmitter {
	app: ThreeApp;
	sources: SourceType[] = [];
	items: { [name: SourceType["name"]]: LoadedItemType } = {};
	toLoad = 0;
	loaded = 0;
	loaders: {
		dracoLoader?: DRACOLoader;
		gltfLoader?: GLTFLoader;
		textureLoader?: THREE.TextureLoader;
		cubeTextureLoader?: THREE.CubeTextureLoader;
	} = {};
	loadingManager = new THREE.LoadingManager();

	private _videoLoader = {
		load: (url: string, callback: (element: HTMLVideoElement) => unknown) => {
			try {
				const urlInstance = new URL(url);
				const element = document.createElement("video");

				element.muted = true;
				element.loop = true;
				element.controls = true;
				element.playsInline = true;
				element.autoplay = true;
				element.src = urlInstance.href;
				element.play();
				element.oncanplaythrough = () => {
					element.play();
					callback(element);
				};
			} catch (_) {
				return;
			}
		},
	};

	constructor(sources?: SourceType[]) {
		super();

		this.app = new ThreeApp();

		if (sources) {
			this.setSources(sources);
		}
		this.setLoaders();
	}

	setSources(sources: SourceType[]) {
		this.toLoad = (this.sources = sources ?? []).length;
		this.loaded = 0;

		return this.toLoad;
	}

	addSource(source: SourceType) {
		this.sources.push(source);
		return (this.toLoad = this.sources.length);
	}

	getSource(sourceName: string): SourceType | undefined {
		return this.sources.filter((source) => source.name === sourceName)[0];
	}

	removeSource(sourceName: string) {
		this.toLoad = (this.sources = this.sources.filter(
			(source) => source.name === sourceName,
		)).length;

		if (this.loaded > this.toLoad) this.loaded = this.toLoad - 1;

		return this.toLoad;
	}

	setLoaders() {
		this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager);
		this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(
			this.loadingManager,
		);
	}

	setDracoLoader(dracoDecoderPath: string, linkWithGltfLoader = true) {
		this.loaders.dracoLoader = new DRACOLoader(this.loadingManager);
		this.loaders.dracoLoader.setDecoderPath(dracoDecoderPath);

		if (linkWithGltfLoader && this.loaders.gltfLoader) {
			this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
		}
	}

	startLoading() {
		this.emit("start", this.loaded);

		for (const source of this.sources) {
			if (!this.items[source.name]) {
				if (source.type === "gltfModel" && typeof source.path === "string") {
					this.loaders.gltfLoader?.load(source.path, (file) => {
						this.sourceLoaded(source, file);
					});
				}
				if (source.type === "texture" && typeof source.path === "string") {
					this.loaders.textureLoader?.load(source.path, (file) => {
						this.sourceLoaded(source, file);
					});
				}
				if (source.type === "cubeTexture" && typeof source.path === "object") {
					this.loaders.cubeTextureLoader?.load(source.path, (file) => {
						this.sourceLoaded(source, file);
					});
				}
				if (source.type === "video" && typeof source.path === "string") {
					this._videoLoader.load(source.path, (element) => {
						this.sourceLoaded(source, element);
					});
				}
			}
		}
	}

	sourceLoaded(source: SourceType, file: LoadedItemType) {
		this.items[source.name] = file;
		this.loaded++;
		this.emit("progress", this.loaded);

		if (this.loaded === this.toLoad) {
			this.emit("ready", this.items);
		}
	}
}
