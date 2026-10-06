import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import configs from "@quick-threejs/config";

export default defineConfig({
	...configs.vite,
	build: {
		...configs.vite.build,
		lib: {
			entry: resolve(import.meta.dirname, "src/main.ts"),
			name: "QuickThreeUtils",
			fileName: "main"
		},
		rolldownOptions: {
			external: ["threads", "three"],
			output: {
				globals: {
					three: "THREE",
					threads: "THREADS"
				}
			}
		}
	},
	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "src/")
		}
	},
	plugins: [...(configs.vite.plugins ?? []), dts()]
});
