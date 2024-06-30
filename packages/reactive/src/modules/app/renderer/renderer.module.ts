import { inject, singleton } from "tsyringe";

import { RendererComponent } from "./renderer.component";
import { RendererController } from "./renderer.controller";
import type { Module } from "../../../common/interfaces/module.interface";
import type { OffscreenCanvasWithStyle } from "../../../common/interfaces/canvas.interface";

@singleton()
export class RendererModule implements Module {
	constructor(
		@inject(RendererComponent) private readonly component: RendererComponent,
		@inject(RendererController) private readonly controller: RendererController
	) {}

	public init(canvas: OffscreenCanvasWithStyle): void {
		this.controller.step$.subscribe(() => this.component.render());

		this.controller.resize$.subscribe((size) =>
			this.component.setSize(size.x, size.y)
		);

		this.component.init(canvas);
	}

	public dispose() {
		throw new Error("Method not implemented.");
	}
}
