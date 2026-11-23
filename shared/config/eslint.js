// @ts-check

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier/flat");
const turbo = require("eslint-config-turbo/flat");
const globals = require("globals");

/**
 * @description
 *
 * Minimal flat ESLint configuration for TypeScript projects.
 *
 * @see [typescript-eslint](https://typescript-eslint.io/getting-started)
 */
module.exports = tseslint.config(
	{
		ignores: [
			"**/__tests__/**",
			"**/*.*.js",
			"**/*.d.ts",
			"**/*.config.ts",
			"**/node_modules/**",
			"**/dist/**",
			"**/lib/**"
		]
	},
	eslint.configs.recommended,
	tseslint.configs.recommended,
	prettier,
	...turbo.default,
	{
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		rules: {
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-duplicate-enum-values": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-this-alias": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-var-requires": "off",
			"no-undef": "off",
			"no-unused-vars": "off",
			eqeqeq: "error",
			quotes: ["error", "double"],
			semi: ["error", "always"]
		}
	}
);
