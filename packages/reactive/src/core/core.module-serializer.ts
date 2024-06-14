import { SerializerImplementation } from "threads";
import { ObjectLoader, Scene } from "three";

export const coreModuleSerializer: SerializerImplementation = {
	deserialize(message: any, defaultHandler) {
		if (message?.object?.type === "Scene") {
			const loader = new ObjectLoader();

			return loader.parse(message);
		} else {
			return defaultHandler(message);
		}
	},

	serialize(thing, defaultHandler) {
		if (thing instanceof Scene) {
			return thing.toJSON();
		} else {
			return defaultHandler(thing);
		}
	}
};
