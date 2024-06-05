"use strict";

import { defineConfig } from "vite";
import { resolve } from "path";
import { vite } from "@quick-threejs/config";

export default defineConfig({
	...vite,
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			name: "QuickThreejs",
			fileName: "quick-threejs"
		},
		copyPublicDir: false,
		watch: {
			include: [resolve(__dirname, "src")]
		},
		rollupOptions: {
			external: ["three"],
			output: {
				exports: "named",
				globals: {
					"quick-threejs": "QuickThreejs",
					three: "Three"
				}
			}
		}
	},
	optimizeDeps: {
		exclude: ["three"]
	}
});
