/* eslint-disable @typescript-eslint/no-require-imports */

export const getAvailableCoresCount = (): number => {
	try {
		if (!window) {
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

export const getSafeAvailableCoresCount = (): number =>
	getAvailableCoresCount() - 1;
