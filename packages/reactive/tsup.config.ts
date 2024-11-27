import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/main.ts", "src/main.worker.ts"],
	format: ["cjs", "esm"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true
});
