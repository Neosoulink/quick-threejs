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
			this.controller.setWidth(size.x);
			this.controller.setHeight(size.y);
			this.controller.setAspect(size.x / size.y);
		});

		this.component.init(canvas);

		this.controller.width$.subscribe((value) => {
			this.component.width = Number(value);
		});

		this.controller.height$.subscribe((value) => {
			this.component.height = Number(value);
		});

		this.controller.aspect$.subscribe((value) => {
			this.component.aspect = Number(value);
		});

		this.controller.pixelRatio$.subscribe((value) => {
			this.component.pixelRatio = Number(value);
		});

		this.controller.enabled$.subscribe((value) => {
			this.component.enabled = !!value;
		});

		this.controller.frustrum$.subscribe((value) => {
			this.component.frustrum = Number(value);
		});
	}

	public setWidth(value = 0) {
		this.controller.setWidth(value);
	}

	public setHeight(value = 0) {
		this.controller.setHeight(value);
	}

	public setAspect(value = 0) {
		this.controller.setAspect(value);
	}

	public setPixelRatio(value = 0) {
		this.controller.setPixelRatio(value);
	}

	public setWatchResizes(value = true) {
		this.controller.setEnabled(value);
	}

	public setFrustrum(value = 5) {
		this.controller.setFrustrum(value);
	}

	dispose() {
		throw new Error("Method not implemented.");
	}
}
