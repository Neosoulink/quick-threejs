export const getAvailableCoresNumber = (): number => {
	try {
		if (typeof window === "undefined") {
			const os = require("os");
			return os.cpus().length;
		} else if (navigator?.hardwareConcurrency) {
			return navigator.hardwareConcurrency;
		} else {
			throw new Error("Unable to determine the number of cores");
		}
	} catch (error) {
		console.error("🛑 Unable to detect available cores", error);
		return 2;
	}
};

export const getSafeAvailableCoresNumber = (): number => {
	return getAvailableCoresNumber() - 1;
};
