import { inject, singleton } from "tsyringe";

import { RendererComponent } from "./renderer.component";
import { RendererController } from "./renderer.controller";
import { Module } from "../../common/interfaces/module.interface";
import { CameraComponent } from "../camera/camera.component";

@singleton()
export class RendererModule implements Module {
	constructor(
		@inject(RendererComponent) private readonly component: RendererComponent,
		@inject(CameraComponent)
		private readonly cameraComponent: CameraComponent,
		@inject(RendererController) private readonly controller: RendererController
	) {}

	public init(canvas: HTMLCanvasElement): void {
		this.controller.step$.subscribe(() => {
			this.component.render(this.cameraComponent.getCamera());
		});

		this.controller.resize$.subscribe((size) =>
			this.component.setSize(size.x, size.y)
		);

		this.component.init(canvas);
	}
}
