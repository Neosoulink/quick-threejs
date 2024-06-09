import { inject, singleton } from "tsyringe";

import { CameraComponent } from "./camera.component";
import { CameraController } from "./camera.controller";
import { Module } from "../../common/interfaces/module.interface";
import { SizesController } from "../sizes/sizes.controller";

@singleton()
export class CameraModule implements Module {
	constructor(
		@inject(CameraComponent) private readonly component: CameraComponent,
		@inject(CameraController) private readonly controller: CameraController,
		@inject(SizesController) private readonly sizeController: SizesController
	) {}

	init() {
		this.sizeController.aspect$.subscribe((aspect) => {
			this.component.aspectRatio = aspect;
		});

		this.controller.quaternion$.subscribe(
			(quaternion) => (this.component.quaternion = quaternion)
		);

		this.controller.step$.subscribe(() =>
			this.component.camera.updateMatrixWorld(true)
		);
	}
}
