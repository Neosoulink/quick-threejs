import { JsonSerializable } from "threads";
import { ImageBitmapLoader, Loader } from "three";
import { DRACOLoader, Font } from "three/examples/jsm/Addons";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

/** @description The sources of the {@link LoaderResource resources} to load. */
export interface LoaderSource {
	/** @description The name (key) of the resource. */
	name: string;
	/** @description The path to the resource file. */
	path: string | string[];
	/** @description The type of the resource. */
	type: "audio" | "image" | "video" | "gltf" | "font";
	options?: {
		/** @description Set the cross origin attribute for the source element. */
		crossOrigin?: string;
		/**
		 * @description Set the image bitmap options for the this source.
		 *
		 * @important Only for the `image` type.
		 */
		imageBitmap?: Parameters<ImageBitmapLoader["setOptions"]>[0];
		/**
		 * @description Set the draco decoder options for the this source.
		 *
		 * @important Only for the `gltf` type.
		 */
		draco?: {
			/** @description The path to the draco decoder for the this source. */
			path?: Parameters<DRACOLoader["setDecoderPath"]>[0];
			/** @description The config for the draco decoder for the this source. */
			config?: Parameters<DRACOLoader["setDecoderConfig"]>[0];
			/** @description The worker limit for the draco decoder for the this source. */
			workerLimit?: Parameters<DRACOLoader["setWorkerLimit"]>[0];
		};
		/** @description The path to the resource file for the this source. */
		path?: Parameters<Loader["setPath"]>[0];
		/** @description Set the request header for the this source. */
		requestHeader?: Parameters<Loader["setRequestHeader"]>[0];
		/** @description Set the resource path for the this source. */
		resourcePath?: Parameters<Loader["setResourcePath"]>[0];
		/** @description Load resource with credentials for the this source. */
		withCredentials?: Parameters<Loader["setWithCredentials"]>[0];
	};
}

/** @description Supported loadable resource. */
export type LoaderResource =
	| GLTF
	| ImageBitmap
	| HTMLVideoElement
	| AudioBuffer
	| Font;

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
	resource?:
		| JsonSerializable
		| { [key: string]: Float32Array | JsonSerializable };
}
