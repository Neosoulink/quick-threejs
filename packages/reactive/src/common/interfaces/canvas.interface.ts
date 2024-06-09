export interface OffscreenCanvasWithStyle extends OffscreenCanvas {
	style: Partial<CSSStyleDeclaration> & {
		width: CSSStyleDeclaration["width"];
		height: CSSStyleDeclaration["height"];
	};
}
