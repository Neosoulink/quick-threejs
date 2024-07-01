export const isUndefined = (value: any) => {
	return value === undefined;
};

export const isNull = (value: any) => {
	return value === null;
};

export const isBoolean = (value: any) => {
	return typeof value === "boolean";
};

export const isObject = (value: any) => {
	return value !== null && typeof value === "object";
};

export const isString = (value: any) => {
	return !!value && typeof value === "string";
};

export const isFunction = (value: any) => {
	return !!value && typeof value === "function";
};
