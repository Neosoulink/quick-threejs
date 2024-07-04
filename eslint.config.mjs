import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	{
		ignores: ["packages/**/*", "shared/**/*"]
	},
	...compat.extends("./node_modules/@quick-threejs/config/eslint.js"),
	{
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",

			parserOptions: {
				project: true,
				tsconfigRootDir: "./"
			}
		}
	}
];
