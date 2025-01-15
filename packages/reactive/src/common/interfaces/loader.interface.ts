import { JsonSerializable } from "threads";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

/** @description The sources of the {@link LoaderResource resources} to load. */
export interface LoaderSource {
	name: string;
	type: "audio" | "image" | "video" | "gltf";
	path: string | string[];
}

/** @description Supported loadable resource. */
export type LoaderResource = GLTF | ImageBitmap | ImageBitmap[] | AudioBuffer;

/** @description Represent a loaded resource. */
export interface LoadedResourcePayload {
	source: LoaderSource;
	resource?: LoaderResource;
	/** @description The number of loaded resources. */
	loadedCount: number;
	/** @description The number of resources to load. */
	toLoadCount: number;
}

export interface SerializedLoadedResourcePayload
	extends Omit<LoadedResourcePayload, "resource"> {
	resource?: JsonSerializable;
}
