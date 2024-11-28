import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import configs from "@quick-threejs/config";

export default defineConfig({
	...configs.vite,
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			name: "QuickThreeUtils",
			fileName: "main"
		},
		rollupOptions: {
			external: ["three", "rxjs", "threads"],
			output: {
				globals: {
					three: "THREE",
					rxjs: "rxjs",
					threads: "threads"
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