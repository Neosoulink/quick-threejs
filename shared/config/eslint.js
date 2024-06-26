const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: [
		"eslint:recommended",
		"prettier",
		"eslint-config-turbo",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["only-warn", "@typescript-eslint"],
	globals: {
		React: true,
		JSX: true
	},
	env: {
		node: true
	},
	settings: {
		"import/resolver": {
			typescript: {
				project
			}
		}
	},
	overrides: [
		{
			files: ["*.js?(x)", "*.ts?(x)"]
		}
	],
	rules: {
		quotes: ["error", "double"],
		semi: ["error", "always"],
		eqeqeq: "error",
		"@typescript-eslint/no-this-alias": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/ban-ts-comment": "off"
	},
	ignorePatterns: [
		"**/__tests__/*",
		"node_modules/",
		"dist/",
		"lib/",
		"vite.config.ts",
		".*.js",
		"*.d.ts"
	]
};
