import { defineConfig } from "vite";

import pkg from "./package.json";
import { resolve } from "path";

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version)
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
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
	resolve: {
		alias: {
			"@": "/src"
		}
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
								<title>Custom Page</title>
							</head>
							<body>
								<div id="app"></div>
								<script type="module" src="/src/main.ts"></script>
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
