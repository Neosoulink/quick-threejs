import { inject, singleton } from "tsyringe";
import { OrthographicCamera, PerspectiveCamera } from "three";

import { CameraComponent } from "./camera.component";
import { CameraController } from "./camera.controller";
import { SizesComponent } from "../sizes/sizes.component";
import type { Module } from "../../common/interfaces/module.interface";

@singleton()
export class CameraModule implements Module {
	constructor(
		@inject(CameraComponent) private readonly component: CameraComponent,
		@inject(SizesComponent) private readonly sizesComponent: SizesComponent,
		@inject(CameraController) private readonly controller: CameraController
	) {}

	public init(useDefaultCamera?: boolean, withMiniCamera?: boolean) {
		if (useDefaultCamera) this.component.setDefaultCamera();
		if (withMiniCamera) this.component.setMiniCamera();

		this.controller.step$.subscribe(() => {
			if (!this.component.enabled) return;
			this.component.aspectRatio = this.sizesComponent.aspect;

			if (
				this.component.instance instanceof PerspectiveCamera ||
				this.component.instance instanceof OrthographicCamera
			)
				this.component.instance?.updateProjectionMatrix();
			this.component.miniCamera?.updateProjectionMatrix();
		});
	}

	public dispose() {
		this.component.removeCamera();
		this.component.removeMiniCamera();
	}
}
