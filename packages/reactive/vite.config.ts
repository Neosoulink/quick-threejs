import { defineConfig } from "vite";
import { resolve } from "path";
import vite from "@quick-threejs/config/vite";

const appEntryPath = resolve(`./src/main.ts`);

export default defineConfig({
	...vite,
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
							<style>html,body{margin:0;padding:0;top:0;left:0;overflow:hidden;}</style>
						</head>
						<body>
							<script type="module" src="${appEntryPath}"></script>
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
