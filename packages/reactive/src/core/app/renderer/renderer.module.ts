import { inject, singleton } from "tsyringe";
import { Vector2Like } from "three";

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
		this.controller.enable$.subscribe((status) => {
			this.component.enabled = !!status;
		});
		this.controller.step$.subscribe(() => this.component.render());
		this.controller.resize$.subscribe((size) =>
			this.component.setSize(size.windowWidth, size.windowHeight)
		);

		this.component.init(canvas);
	}

	public dispose() {
		this.controller.enable$$.unsubscribe();
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this.controller.enable$$.next(value);
		return this.component.enabled;
	}

	public instance() {
		return this.component.instance;
	}

	public setSize(value: Vector2Like) {
		return this.component.setSize(value.x, value.y);
	}

	public render() {
		return this.component.render();
	}

	public enabled$() {
		return this.controller.enable$;
	}
}
