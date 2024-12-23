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
			external: ["three"],
			output: {
				globals: {
					three: "THREE"
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
