export interface OffscreenCanvasStb extends OffscreenCanvas {
	style: Partial<CSSStyleDeclaration> & {
		width: CSSStyleDeclaration["width"];
		height: CSSStyleDeclaration["height"];
	};
}
