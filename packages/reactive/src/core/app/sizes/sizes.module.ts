import { inject, Lifecycle, scoped } from "tsyringe";

import { SizesService } from "./sizes.service";
import { SizesController } from "./sizes.controller";
import { Module } from "../../../common/interfaces/module.interface";
import { OffscreenCanvasWithStyle } from "../../../common/interfaces/canvas.interface";

@scoped(Lifecycle.ContainerScoped)
export class SizesModule implements Module {
	constructor(
		@inject(SizesController) private readonly _controller: SizesController,
		@inject(SizesService) private readonly _service: SizesService
	) {}

	public init(canvas: OffscreenCanvasWithStyle | HTMLCanvasElement) {
		this._controller.resize$.subscribe((size) => {
			this._service.width = size.windowWidth;
			this._service.height = size.windowHeight;
			this._service.aspect = size.windowWidth / size.windowHeight;
		});

		this._service.init(canvas);
	}

	dispose() {}

	public aspect(value?: number) {
		if (typeof value === "number") this._service.aspect = value;
		return this._service.aspect;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public frustrum(value?: number) {
		if (typeof value === "number") this._service.frustrum = value;
		return this._service.frustrum;
	}

	public height(value?: number) {
		if (typeof value === "number") this._service.height = value;
		return this._service.height;
	}

	public pixelRatio(value?: number) {
		if (typeof value === "number") this._service.pixelRatio = value;
		return this._service.pixelRatio;
	}

	public width(value?: number) {
		if (typeof value === "number") this._service.width = value;
		return this._service.width;
	}

	public resize$() {
		return this._controller.resize$;
	}
}
