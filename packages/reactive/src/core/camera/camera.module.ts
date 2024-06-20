import { inject, singleton } from "tsyringe";
import { Camera, OrthographicCamera, PerspectiveCamera } from "three";

import { CameraComponent } from "./camera.component";
import { CameraController } from "./camera.controller";
import { Module } from "../../common/interfaces/module.interface";
import { CameraType } from "../../common/enums/camera.enum";
import { SizesComponent } from "../sizes/sizes.component";
import { TimerController } from "../timer/timer.controller";
import { SizesController } from "../sizes/sizes.controller";

@singleton()
export class CameraModule implements Module {
	constructor(
		@inject(CameraComponent) private readonly component: CameraComponent,
		@inject(SizesComponent) private readonly sizesComponent: SizesComponent,
		@inject(CameraController) private readonly controller: CameraController,
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(SizesController) private readonly sizeController: SizesController
	) {}

	private _setDefaultCamera(cameraType?: CameraType) {
		this.removeCamera();

		if (cameraType === CameraType.PERSPECTIVE || cameraType === undefined) {
			this.component.instance = new PerspectiveCamera(
				70,
				this.sizesComponent.width / this.sizesComponent.height,
				0.0001,
				100
			);

			this.component.instance.position.z = 8;
			return;
		}

		if (cameraType === CameraType.ORTHOGRAPHIC) {
			this.component.instance = new OrthographicCamera(
				(-this.sizesComponent.aspect * this.sizesComponent.frustrum) / 2,
				(this.sizesComponent.aspect * this.sizesComponent.frustrum) / 2,
				this.sizesComponent.frustrum / 2,
				-this.sizesComponent.frustrum / 2,
				-50,
				50
			);
		}
	}

	private _setMiniCamera() {
		this.removeMiniCamera();

		this.component.miniCamera = new PerspectiveCamera(
			75,
			this.sizesComponent.width / this.sizesComponent.height,
			0.1,
			500
		);
		this.component.miniCamera.position.z = 8;
	}

	public get instance() {
		return this.component.instance;
	}

	public init(useDefaultCamera?: boolean, withMiniCamera?: boolean) {
		if (useDefaultCamera) this._setDefaultCamera();
		if (withMiniCamera) this._setMiniCamera();

		this.sizeController.aspect$.subscribe(
			(aspect) => (this.component.aspectRatio = aspect)
		);

		this.controller.quaternion$.subscribe(
			(quaternion) => (this.component.quaternion = quaternion)
		);

		this.timerController.step$.subscribe(() => {
			if (!this.component.enabled) return;

			if (
				this.component.instance instanceof PerspectiveCamera ||
				this.component.instance instanceof OrthographicCamera
			)
				this.component.instance?.updateProjectionMatrix();
			this.component.miniCamera?.updateProjectionMatrix();
		});
	}

	public removeCamera() {
		if (!(this.component.instance instanceof Camera)) return;
		if (
			this.component.instance instanceof PerspectiveCamera ||
			this.component.instance instanceof OrthographicCamera
		)
			this.component.instance.clearViewOffset();
		this.component.instance.clear();
		this.component.instance = undefined;
	}

	public removeMiniCamera() {
		if (!(this.component.miniCamera instanceof Camera)) return;
		this.component.miniCamera.clearViewOffset();
		this.component.miniCamera.clear();
		this.component.miniCamera = undefined;
	}

	public dispose() {
		this.removeCamera();
		this.removeMiniCamera();
	}
}
