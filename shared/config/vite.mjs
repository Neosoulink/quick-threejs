import { defineConfig } from "vite";
import pkg from "./package.json" assert { type: "json" };

export default defineConfig(
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
