// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tsEslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default tsEslint.config(
	...tsEslint.configs.recommended,
	...compat.extends("./node_modules/@quick-threejs/config/eslint"),
	{
		ignores: ["packages/**/*", "shared/**/*"]
	},
	{
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script"
		}
	}
);
