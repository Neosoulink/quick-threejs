import { resolve } from "path";
import { defineConfig } from "vite";
import configs from "@quick-threejs/config";

export default defineConfig({
	...configs.vite,
	build: {
		...configs.vite.build,
		rolldownOptions: {
			input: {
				worker: "src/main.worker.ts",
				index: "index.html"
			},
			output: {
				entryFileNames: "[name].js"
			}
		}
	},

	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "src/")
		}
	}
});
