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

	public init(canvas: OffscreenCanvasWithStyle) {
		this.controller.resize$.subscribe((size) => {
			this.component.width = size.x;
			this.component.height = size.y;
			this.component.aspect = size.x / size.y;
		});

		this.component.init(canvas);
	}

	dispose() {
		throw new Error("Method not implemented.");
	}
}
