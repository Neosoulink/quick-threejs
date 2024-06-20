import { inject, singleton } from "tsyringe";

import { RendererComponent } from "./renderer.component";
import { RendererController } from "./renderer.controller";
import { CameraComponent } from "../camera/camera.component";
import { Module } from "../../common/interfaces/module.interface";
import { OffscreenCanvasWithStyle } from "../../common/interfaces/canvas.interface";
import { SizesController } from "../sizes/sizes.controller";
import { TimerController } from "../timer/timer.controller";

@singleton()
export class RendererModule implements Module {
	constructor(
		@inject(RendererComponent) private readonly component: RendererComponent,
		@inject(RendererController) private readonly controller: RendererController,
		@inject(SizesController) private readonly sizesController: SizesController,
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(CameraComponent) private readonly cameraComponent: CameraComponent
	) {}

	public init(canvas: OffscreenCanvasWithStyle): void {
		this.timerController.step$.subscribe(() => {
			if (this.cameraComponent.instance)
				this.component.render(this.cameraComponent.instance);
		});

		this.sizesController.resize$.subscribe((size) =>
			this.component.setSize(size.x, size.y)
		);

		this.component.init(canvas);
	}

	public dispose() {
		throw new Error("Method not implemented.");
	}
}
