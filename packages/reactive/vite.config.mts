import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { glslify } from "vite-plugin-glslify";
import configs from "@quick-threejs/config";

export default defineConfig({
	...configs.vite,
	build: {
		...configs.vite.build,
		lib: {
			entry: {
				main: resolve(import.meta.dirname, "src/main.ts"),
				worker: resolve(import.meta.dirname, "src/main.worker.ts")
			},
			name: "QuickThreeReactive"
		},
		rolldownOptions: {
			external: [
				"three",
				"three/webgpu",
				"three/examples/jsm/inspector/Inspector.js"
			],
			output: {
				globals: {
					three: "THREE"
				}
			}
		}
	},

	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "./src")
		}
	},
	plugins: [...(configs.vite.plugins ?? []), dts(), glslify()]
});
