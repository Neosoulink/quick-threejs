export default {
	"**/*.{js,jsx,ts,tsx}": ["pnpm run lint", "pnpm run format"],
	"**/*.{html,json,css,scss,md,mdx}": ["pnpm run format"]
};
