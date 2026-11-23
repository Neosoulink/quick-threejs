// @ts-check

import config from "@quick-threejs/config/eslint";

export default [
	...config,
	{
		ignores: ["packages/**/*", "shared/**/*", "**/.react-router/**"]
	}
];
