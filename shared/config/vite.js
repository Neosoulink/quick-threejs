// @ts-check
const path = require("path");
const pkg = require("./package.json");

/** @type {import("vite").UserConfig} */
const config = {
	define: {
		__CONFIGS_VERSION__: JSON.stringify(pkg.version)
	},
	plugins: [
		{
			name: "quick-threejs:ignore-dist-watch",
			apply: "build",
			enforce: "pre",
			buildStart() {
				if (!this.meta.watchMode) return;

				const proto = Object.getPrototypeOf(this);
				if (proto.__quickThreejsIgnoreDistWatch) return;

				const original = proto.addWatchFile;
				const root = path.resolve(this.environment.config.root);
				const outDir = path.resolve(root, this.environment.config.build.outDir);

				// vite-plugin-dts watches the package root and expects chokidar to
				// ignore `dist`. Vite 8's watcher drops that ignore, so each emit
				// restarts the build. Keep file watches; skip the root and output.
				proto.addWatchFile = function (id) {
					const resolved = path.resolve(String(id));
					if (
						resolved === root ||
						resolved === outDir ||
						resolved.startsWith(outDir + path.sep)
					) {
						return;
					}
					return original.call(this, id);
				};
				proto.__quickThreejsIgnoreDistWatch = true;
			}
		}
	]
};

if (process.argv.includes("--watch") || process.argv.includes("-w")) {
	config.build = {
		watch: {
			exclude: [/[/\\]dist[/\\]/, /[/\\]node_modules[/\\]/]
		}
	};
}

module.exports = config;
