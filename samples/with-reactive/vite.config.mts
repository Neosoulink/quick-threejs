import { resolve } from "path";
import { defineConfig } from "vite";
import configs from "@quick-threejs/config";

export default defineConfig({
	...configs.vite,
	build: {
		rollupOptions: {
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
			"@/": resolve(__dirname, "src/")
		}
	}
});
