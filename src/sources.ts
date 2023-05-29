export interface SourceType {
	name: string;
	type: "cubeTexture" | "texture" | "gltfModel";
	path: string | string[];
}

const SOURCES: SourceType[] = [];

export default SOURCES;
