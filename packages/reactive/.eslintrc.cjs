module.exports = {
	extends: [require.resolve("@quick-threejs/config/eslint")],
	root: true,
	parserOptions: {
		project: true
	},
	overrides: [
		{
			files: ["*.js?(x)", "*.ts?(x)"],
			env: {
				browser: true,
				es2021: true
			}
		}
	],
	ignorePatterns: ["**/.eslintrc.cjs"]
};
