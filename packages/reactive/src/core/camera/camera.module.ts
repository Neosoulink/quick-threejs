import { inject, singleton } from "tsyringe";

import { CameraComponent } from "./camera.component";
import { CameraController } from "./camera.controller";
import { Module } from "../../common/interfaces/module.interface";

@singleton()
export class CameraModule implements Module {
	constructor(
		@inject(CameraComponent) private readonly component: CameraComponent,
		@inject(CameraController) private readonly controller: CameraController
	) {}

	init() {
		this.controller.resize$.subscribe((size) =>
			this.component.setAspectRatio(size.x / size.y)
		);
		this.controller.quaternion$.subscribe((quaternion) =>
			this.component.setQuaternion(quaternion)
		);
	}
}
