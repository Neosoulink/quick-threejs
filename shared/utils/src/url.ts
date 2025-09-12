export const generateScriptUrl = (content: string) => {
	const blob = new Blob([content], { type: "text/javascript" });
	return URL.createObjectURL(blob);
};
