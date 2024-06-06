module.exports = {
	extends: [require.resolve("@quick-threejs/config/eslint")],
	root: true,
	parserOptions: {
		project: "./tsconfig.json",
		ecmaVersion: "latest",
		sourceType: "module",
		tsconfigRootDir: __dirname
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
