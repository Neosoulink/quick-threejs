const { defineConfig } = require("vite");
const { resolve } = require("path");
const vite = require("@quick-threejs/config/eslint");

module.exports = defineConfig({
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
