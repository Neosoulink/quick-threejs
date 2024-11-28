import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import configs from "@quick-threejs/config";

export default defineConfig({
	...configs.vite,
	build: {
		lib: {
			entry: {
				main: resolve(__dirname, "src/main.ts"),
				worker: resolve(__dirname, "src/main.worker.ts")
			},
			name: "QuickThreeReactive"
		},
		rollupOptions: {
			external: [
				"@quick-threejs/utils",
				"rxjs",
				"threads",
				"three",
				"stats.js"
			],
			output: {
				globals: {
					"@quick-threejs/utils": "QuickThreeUtils",
					rxjs: "rxjs",
					threads: "Threads",
					three: "THREE",
					"stats.js": "Stats"
				}
			}
		}
	},

	resolve: {
		alias: {
			"@/": resolve(__dirname, "src/")
		}
	},
	plugins: [dts()]
});
