const { defineConfig } = require("vite");
const pkg = require("./package.json");

/** @type {import('vite').UserConfig} */
module.exports = defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version)
	}
});
