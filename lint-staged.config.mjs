const isReleasing = process.env.CI_RELEASE === "true";

export default {
	"**/*.{js,jsx,ts,tsx,html,json,css,scss,md,mdx}": isReleasing
		? []
		: ["pnpm run lint", "pnpm run format"]
};
