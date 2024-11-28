// @ts-check
const pkg = require("./package.json");

/** @type {import("vite").UserConfig} */
module.exports = {
	define: {
		__CONFIGS_VERSION__: JSON.stringify(pkg.version)
	}
};
