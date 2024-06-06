module.exports = {
	extends: [require.resolve("@quick-threejs/config/eslint")],
	root: true,
	parserOptions: {
		project: "./tsconfig.json",
		ecmaVersion: "latest",
		sourceType: "module",
		tsconfigRootDir: __dirname
	}
};
