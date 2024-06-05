"use strict";

import { defineConfig } from "vite";
import { resolve } from "path";
import { vite } from "@quick-threejs/config";

import pkg from "./package.json" assert { type: "json" };

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
	},
	plugins: [
		(() => {
			return {
				name: "custom-html-plugin",
				configureServer: (server) => {
					server.middlewares.use((req, res, next) => {
						if (req.url === "/")
							res.end(`
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8">
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>${pkg.name}</title>
						</head>
						<body>
							<script type="module" src="/src/main/main.ts"></script>
						</body>
						</html>
					`);
						else next();
					});
				}
			};
		})()
	]
});
