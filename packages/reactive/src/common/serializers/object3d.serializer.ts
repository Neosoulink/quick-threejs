import { SerializerImplementation } from "threads";
import { Object3D, ObjectLoader } from "three";

import { deserializeJSON, toSerializedJSON } from "@quick-threejs/utils";

const objectLoader = new ObjectLoader();

export const object3DSerializer: SerializerImplementation = {
	deserialize(message: any, defaultHandler) {
		if (message?.isSerialized) return deserializeJSON(message, objectLoader);
		return defaultHandler(message);
	},

	serialize(thing, defaultHandler) {
		if (thing instanceof Object3D) return toSerializedJSON(thing);

		return defaultHandler(thing);
	}
};
