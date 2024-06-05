import { defineConfig } from "vite";
import pkg from "./package.json" assert { type: "json" };

export default defineConfig(
	/** @type {import('vite').UserConfig} */
	{
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version)
		},
		resolve: {
			alias: {
				"@": "./src"
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
	}
);
