import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "path";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import { glslify } from "vite-plugin-glslify";
import configs from "@quick-threejs/config";

const require = createRequire(import.meta.url);

/**
 * Rolldown wraps the CJS `reflect-metadata` build in a pure lazy initializer and
 * never calls it, so tsyringe's startup check runs first. Prepend the polyfill
 * so it executes before that check in every chunk that contains it.
 */
const reflectMetadataBeforeTsyringe = (): Plugin => {
	const reflectSource = readFileSync(require.resolve("reflect-metadata"), "utf8");

	return {
		name: "quick-threejs:reflect-metadata-before-tsyringe",
		generateBundle(_options, bundle) {
			for (const file of Object.values(bundle)) {
				if (file.type !== "chunk") continue;
				if (!file.code.includes("tsyringe requires a reflect polyfill")) continue;
				file.code = `${reflectSource}\n${file.code}`;
			}
		}
	};
};

export default defineConfig({
	...configs.vite,
	build: {
		...configs.vite.build,
		lib: {
			entry: {
				main: resolve(import.meta.dirname, "src/main.ts"),
				worker: resolve(import.meta.dirname, "src/main.worker.ts")
			},
			name: "QuickThreeReactive"
		},
		rolldownOptions: {
			external: [
				"three",
				"three/webgpu",
				"three/examples/jsm/inspector/Inspector.js"
			],
			output: {
				globals: {
					three: "THREE"
				}
			}
		}
	},

	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "./src")
		}
	},
	plugins: [
		...(configs.vite.plugins ?? []),
		reflectMetadataBeforeTsyringe(),
		dts(),
		glslify()
	]
});
