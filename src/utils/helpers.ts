import { Material } from "three";

export function disposeMaterial(material: Material) {
	// @ts-ignore
	if (material.map) material.map.dispose();

	material.dispose();
}
