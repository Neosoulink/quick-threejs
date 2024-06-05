/** @type {import("eslint").Linter.Config} */
export default {
	extends: ["@quick-threejs/config/eslint.js"],
	root: true,
	parserOptions: {
		project: "./tsconfig.json",
		ecmaVersion: "latest",
		sourceType: "module"
	},
	overrides: [
		{
			files: ["*.js?(x)", "*.ts?(x)"],
			env: {
				browser: true,
				es2021: true
			}
		}
	]
};
