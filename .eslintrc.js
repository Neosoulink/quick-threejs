// This configuration only applies to the package manager root.
module.exports = {
	extends: [require.resolve("@quick-threejs/config/eslint")],
	root: true,
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname
	},
	ignorePatterns: ["packages/**", "shared/**"]
};
