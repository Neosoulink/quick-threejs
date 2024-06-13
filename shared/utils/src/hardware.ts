export const getAvailableCoresNumber = (): number => {
	try {
		if (typeof window === "undefined") {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const os = require("os");
			return os.cpus().length;
		} else if (navigator?.hardwareConcurrency) {
			return navigator.hardwareConcurrency;
		} else {
			throw new Error("Unable to determine the number of cores");
		}
	} catch (error) {
		console.error("Error detecting available cores:", error);
		return 2;
	}
};

export const getSafeAvailableCoresNumber = (): number => {
	return getAvailableCoresNumber() - 1;
};
