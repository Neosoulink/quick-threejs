import { Lifecycle, scoped } from "tsyringe";

import { ProxyEvent, type OffscreenCanvasStb } from "@/common";

@scoped(Lifecycle.ContainerScoped)
export class SizesService {
	public width = 0;
	public height = 0;
	public wrapperWidth = 0;
	public wrapperHeight = 0;
	public windowWidth = 0;
	public windowHeight = 0;
	public aspect = 0;
	public pixelRatio = 1;
	public frustrum = 5;
	public enabled = true;
	public fullscreen = false;
	public hasCanvasWrapper = false;

	public init(
		canvas: OffscreenCanvasStb | HTMLCanvasElement,
		pixelRatio = 1,
		fullscreen = true,
		hasCanvasWrapper = false,
		enabled = true
	) {
		this.height = Number(canvas.height ?? this.height);
		this.width = Number(canvas.width ?? this.width);
		this.aspect = this.width / this.height;
		this.pixelRatio = typeof pixelRatio === "number" ? pixelRatio : 1;
		this.fullscreen = fullscreen;
		this.hasCanvasWrapper = hasCanvasWrapper;
		this.enabled = enabled;
	}

	public handleResize(size: UIEvent & ProxyEvent) {
		this.width = size.width;
		this.height = size.height;
		this.wrapperWidth = size.wrapperWidth;
		this.wrapperHeight = size.wrapperHeight;
		this.windowWidth = size.windowWidth;
		this.windowHeight = size.windowHeight;
		this.aspect = this.fullscreen
			? size.windowWidth / size.windowHeight
			: this.hasCanvasWrapper
				? size.wrapperWidth / size.wrapperHeight
				: size.width / size.height;
	}

	public getViewPortSizes() {
		return {
			width: this.fullscreen
				? this.windowWidth
				: this.hasCanvasWrapper
					? this.wrapperWidth
					: this.width,
			height: this.fullscreen
				? this.windowHeight
				: this.hasCanvasWrapper
					? this.wrapperHeight
					: this.height
		};
	}
}
