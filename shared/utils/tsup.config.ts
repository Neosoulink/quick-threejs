import { defineConfig } from "tsup";
import configs from "@quick-threejs/config/tsup.js";

export default defineConfig({
	...configs,
	entry: ["src/main.ts", "src/main.worker.ts"]
});
