import { Object3D, ObjectLoader } from "three";

import { SerializedPosition, SerializedRotation } from "./types/object.type";
import { isObject } from "./type";

export const serializeObject3D = (obj: Object3D) => {
	const serializedObject = obj.toJSON();

	return JSON.stringify({
		...serializedObject,
		object: {
			...serializedObject.object,
			position: ["x", "y", "z"].map(
				(prop) => obj.position[prop as keyof typeof obj.position]
			) as SerializedPosition,
			rotation: ["x", "y", "z", "order"].map(
				(prop) => obj.rotation[prop as keyof typeof obj.rotation]
			) as SerializedRotation,
			children:
				serializedObject?.object?.children?.map((child, i) => ({
					...(typeof child === "object"
						? child
						: typeof child === "string"
							? JSON.parse(child)
							: {}),
					position: ["x", "y", "z"].map(
						(prop) =>
							obj.children[i]?.position[prop as keyof typeof obj.position]
					),
					rotation: ["x", "y", "z", "order"].map(
						(prop) =>
							obj.children[i]?.rotation[prop as keyof typeof obj.rotation]
					)
				})) ?? []
		},
		isSerialized: true
	});
};

export const deserializeObject3D = (
	obj: string,
	loader = new ObjectLoader()
) => {
	const safeObj = JSON.parse(obj);

	if (safeObj?.metadata && safeObj.object && safeObj.isSerialized) {
		const parsedObject = loader.parse(safeObj);

		parsedObject.position.set(
			...(safeObj.object.position as SerializedPosition)
		);
		parsedObject.rotation.set(
			...(safeObj.object.rotation as SerializedRotation)
		);
		parsedObject.children.map((child, id) => {
			child.position.set(
				...(safeObj.object.children[id].position as SerializedPosition)
			);
		});
		parsedObject.children.map((child, id) => {
			child.rotation.set(
				...(safeObj.object.children[id].rotation as SerializedRotation)
			);
		});

		return parsedObject;
	}

	return safeObj;
};

export const recursiveSerializeObject3D = (obj: any) => {
	if (!isObject(obj)) return undefined;

	let objCopy = obj;
	if (obj instanceof Object3D) objCopy = obj.toJSON();
	else if (typeof obj === "object") objCopy = { ...obj };

	for (const key in objCopy) {
		if (Object.prototype.hasOwnProperty.call(objCopy, key)) {
			if (objCopy[key] instanceof Object3D) {
				objCopy[key] = serializeObject3D(objCopy[key]);
			} else recursiveSerializeObject3D(objCopy[key]);
		}
	}

	return objCopy;
};

export const recursiveDeserializeObject3D = (serializedObj: any) => {
	if (!isObject(serializedObj)) return;

	const objCopy = { ...serializedObj };

	for (const key in serializedObj) {
		if (Object.prototype.hasOwnProperty.call(objCopy, key)) {
			if (objCopy[key]?.isSerialized) {
				objCopy[key] = deserializeObject3D(objCopy[key]);
			} else recursiveDeserializeObject3D(objCopy[key]);
		}
	}

	return objCopy;
};

export const copyProperties = <T extends object, U extends keyof T = keyof T>(
	src: T,
	properties: U[]
) => {
	const dst = {
		type: (src as any)?.type
	} as Pick<T, U> & { type?: string };

	for (const name of properties)
		if (src[name] !== undefined) dst[name] = src[name];

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
		if (!properties.includes(name as any)) (dst as any)[name] = value;

	return dst;
};
