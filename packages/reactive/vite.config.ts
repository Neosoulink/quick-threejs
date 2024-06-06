import { defineConfig } from "vite";
import { resolve } from "path";
import vite from "@quick-threejs/config/vite";

const appEntryPath = resolve(`./src/main/main.ts`);

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
