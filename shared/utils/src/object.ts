import { Object3D, ObjectLoader } from "three";

import { SerializedPosition, SerializedRotation } from "./types/object.type";

export const isObject = (obj: any) => {
	return !!obj && typeof obj === "object";
};

export const toSerializedJSON = (obj: Object3D) => {
	const serializedObject = obj.toJSON();

	return {
		...serializedObject,
		object: {
			...serializedObject.object,
			position: ["x", "y", "z"].map(
				(prop) => obj.position[prop]
			) as SerializedPosition,
			rotation: ["x", "y", "z", "order"].map(
				(prop) => obj.rotation[prop]
			) as SerializedRotation,
			children:
				serializedObject?.object?.children?.map(
					(child: Object3D, id: number) => ({
						...child,
						position: ["x", "y", "z"].map(
							(prop) => obj.children[id]?.position[prop]
						),
						rotation: ["x", "y", "z", "order"].map(
							(prop) => obj.children[id]?.rotation[prop]
						)
					})
				) ?? []
		},
		isSerialized: true
	};
};

export const deserializeJSON = (
	obj: {
		metadata?: any;
		object?: any;
		isSerialized: boolean;
	},
	loader = new ObjectLoader()
) => {
	if (obj.metadata && obj.object && obj.isSerialized) {
		const parsedObject = loader.parse(obj);

		parsedObject.position.set(...(obj.object.position as SerializedPosition));
		parsedObject.rotation.set(...(obj.object.rotation as SerializedRotation));
		parsedObject.children.map((child, id) => {
			child.position.set(
				...(obj.object.children[id].position as SerializedPosition)
			);
		});
		parsedObject.children.map((child, id) => {
			child.rotation.set(
				...(obj.object.children[id].rotation as SerializedRotation)
			);
		});

		return parsedObject;
	}

	return obj;
};

export const recursiveToSerializedJSON = (obj: any) => {
	if (!isObject(obj)) return;

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			if (obj[key] instanceof Object3D) {
				obj[key] = toSerializedJSON(obj[key]);
			} else recursiveToSerializedJSON(obj[key]);
		}
	}
};

export const recursiveDeserializeJSON = (obj: any) => {
	if (!isObject(obj)) return;

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			if (obj[key]?.isSerialized) {
				obj[key] = deserializeJSON(obj[key]);
			} else recursiveDeserializeJSON(obj[key]);
		}
	}
};

export const copyProperties = <T extends object, U>(
	src: T,
	properties: (keyof U)[]
) => {
	const dst = {
		type: (src as any)?.type
	} as U & { type?: string };

	for (const name of properties)
		if (src[name as any] !== undefined) dst[name] = src[name as any];

	return dst;
};

export const excludeProperties = <
	T extends object,
	U extends keyof T = keyof T
>(
	src: T,
	properties: U[]
) => {
	const dst = {
		type: (src as any)?.type
	} as Omit<T, U> & { type?: string };

	for (const [name, value] of Object.entries(src))
		if (!properties.includes(name as any)) dst[name] = value;

	return dst;
};
