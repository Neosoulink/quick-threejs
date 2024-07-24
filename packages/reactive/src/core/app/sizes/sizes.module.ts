import { inject, singleton } from "tsyringe";

import { SizesComponent } from "./sizes.component";
import { SizesController } from "./sizes.controller";
import { Module } from "../../../common/interfaces/module.interface";
import { OffscreenCanvasWithStyle } from "../../../common/interfaces/canvas.interface";

@singleton()
export class SizesModule implements Module {
	constructor(
		@inject(SizesComponent) private readonly component: SizesComponent,
		@inject(SizesController) private readonly controller: SizesController
	) {}

	public init(canvas: OffscreenCanvasWithStyle) {
		this.controller.enable$.subscribe((status) => {
			this.component.enabled = !!status;
		});
		this.controller.resize$.subscribe((size: any) => {
			this.component.width = size.x;
			this.component.height = size.y;
			this.component.aspect = size.x / size.y;
		});

		this.component.init(canvas);
	}

	dispose() {}

	public aspect(value?: number) {
		if (typeof value === "number") this.component.aspect = value;
		return this.component.aspect;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this.controller.enable$$.next(value);
		return this.component.enabled;
	}

	public frustrum(value?: number) {
		if (typeof value === "number") this.component.frustrum = value;
		return this.component.frustrum;
	}

	public height(value?: number) {
		if (typeof value === "number") this.component.height = value;
		return this.component.height;
	}

	public pixelRatio(value?: number) {
		if (typeof value === "number") this.component.pixelRatio = value;
		return this.component.pixelRatio;
	}

	public width(value?: number) {
		if (typeof value === "number") this.component.width = value;
		return this.component.width;
	}

	public enabled$() {
		return this.controller.enable$;
	}

	public resize$() {
		return this.controller.resize$;
	}
}
