const { defineConfig } = require("vite");
const pkg = require("./package.json");

module.exports = defineConfig(
	/** @type {import('vite').UserConfig} */
	{
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version)
		},
		resolve: {
			alias: {
				"@": "./src"
			}
		}
	}
);
