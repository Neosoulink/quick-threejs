// @ts-check

import globals from "globals";
import config from "@quick-threejs/config/eslint";

export default [
	...config,
	{
		files: ["src/**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser
			}
		}
	},
	{
		ignores: ["*.config.mjs", "*.config.ts"]
	}
];
