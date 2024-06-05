// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ["@quick-threejs/config/eslint.js"],
	root: true,
	parserOptions: {
		project: true
	},
	ignorePatterns: ["packages/**", "shared/**"]
};
