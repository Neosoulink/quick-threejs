import { CubeTextureLoader, Texture, VideoTexture } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export type LoadedResourceItem =
	| GLTF
	| Texture
	| CubeTextureLoader
	| VideoTexture
	| AudioBuffer;

export interface Resource {
	name: string;
	type: "cubeTexture" | "texture" | "gltfModel" | "video" | "audio";
	path: string | string[];
}

export interface ProgressedResource {
	file?: LoadedResourceItem;
	resource: Resource;
	loaded: number;
	toLoad: number;
}
