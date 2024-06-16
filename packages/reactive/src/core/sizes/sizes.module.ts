import { inject, singleton } from "tsyringe";

import { SizesComponent } from "./sizes.component";
import { SizesController } from "./sizes.controller";
import { Module } from "../../common/interfaces/module.interface";
import { OffscreenCanvasWithStyle } from "../../common/interfaces/canvas.interface";

@singleton()
export class SizesModule implements Module {
	constructor(
		@inject(SizesComponent) private readonly component: SizesComponent,
		@inject(SizesController) private readonly controller: SizesController
	) {}

	init(canvas: OffscreenCanvasWithStyle) {
		this.controller.resize$.subscribe((size) => {
			this.controller.setWidth(size.x);
			this.controller.setHeight(size.y);
			this.controller.setAspect(size.x / size.y);
		});

		this.component.init(canvas);
	}

	dispose(): void {
		throw new Error("Method not implemented.");
	}
}
