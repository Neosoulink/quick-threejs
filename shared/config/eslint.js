// @ts-check

const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * @description
 *
 * Minimal ESLint configuration for TypeScript projects.
 *
 * Using **Legacy** configuration.
 *
 * @see [legacy-eslint-setup](https://typescript-eslint.io/getting-started/legacy-eslint-setup)
 */
module.exports = {
	extends: ["eslint:recommended", "prettier", "eslint-config-turbo"],
	parser: "@typescript-eslint/parser",
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
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-duplicate-enum-values": "off",
		"@typescript-eslint/no-empty-object-type": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-this-alias": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-var-requires": "off",
		"no-undef": "off",
		"no-unused-vars": "off",
		eqeqeq: "error",
		quotes: ["error", "double"],
		semi: ["error", "always"]
	},
	ignorePatterns: [
		"**/__tests__/*",
		"*.*.js",
		"*.d.ts",
		"*.config.ts",
		"node_modules/",
		"dist/",
		"lib/"
	]
};
