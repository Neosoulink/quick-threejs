export default {
	"**/*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0", "prettier --write"],
	"**/*.{html,json,css,scss,md,mdx}": ["prettier -w"]
};
