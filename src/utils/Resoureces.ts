import * as THREE from "three";
import EventEmitter from "events";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// CLASSES
import ThreeApp from "..";

// LOCAL TYPES
export type LoadedItemType = GLTF | THREE.Texture | THREE.CubeTexture;

export interface SourceType {
	name: string;
	type: "cubeTexture" | "texture" | "gltfModel";
	path: string | string[];
}

export default class Resources extends EventEmitter {
	app: ThreeApp;
	sources: SourceType[] = [];
	items: { [name: SourceType["name"]]: LoadedItemType } = {};
	toLoad = 0;
	loaded = 0;
	loaders: {
		gltfLoader?: GLTFLoader;
		textureLoader?: THREE.TextureLoader;
		cubeTextureLoader?: THREE.CubeTextureLoader;
	} = {};
	loadingManager = new THREE.LoadingManager();

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

		if (this.toLoad > this.loaded) this.loaded = this.toLoad;
		return (this.toLoad = this.sources.length);
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
			(source) => source.name === sourceName
		)).length;

		if (this.toLoad > this.loaded) this.loaded = this.toLoad;

		return this.toLoad;
	}

	setLoaders() {
		this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
		this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager);
		this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(
			this.loadingManager
		);
	}

	startLoading() {
		this.emit("start");

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
			}
		}
	}

	sourceLoaded(source: SourceType, file: LoadedItemType) {
		this.items[source.name] = file;
		this.loaded++;

		if (this.loaded === this.toLoad) {
			this.emit("ready", true);
		}
	}
}
