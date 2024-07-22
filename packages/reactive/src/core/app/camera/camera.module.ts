import { inject, singleton } from "tsyringe";
import {
	Camera,
	OrthographicCamera,
	PerspectiveCamera,
	Quaternion,
	Vector3
} from "three";

import { CameraComponent } from "./camera.component";
import { CameraController } from "./camera.controller";
import { SizesComponent } from "../sizes/sizes.component";
import type { Module } from "../../../common/interfaces/module.interface";

@singleton()
export class CameraModule implements Module {
	constructor(
		@inject(CameraComponent) private readonly component: CameraComponent,
		@inject(SizesComponent) private readonly sizesComponent: SizesComponent,
		@inject(CameraController) private readonly controller: CameraController
	) {}

	public init(withMiniCamera?: boolean) {
		this.component.setDefaultCamera();
		if (withMiniCamera) this.component.setMiniCamera();

		this.controller.enable$.subscribe((status) => {
			this.component.enabled = !!status;
		});

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

	public aspectRatio(value?: number) {
		if (value) this.component.aspectRatio = value;
		return this.component.aspectRatio;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this.controller.enable$$.next(value);
		return this.component.enabled;
	}

	public instance(value?: Camera) {
		if (value) this.component.instance;
		return this.component.instance;
	}

	public miniCamera(value?: PerspectiveCamera) {
		if (value) this.component.miniCamera = value;
		return this.component.miniCamera;
	}

	public position(value?: Vector3) {
		if (value) this.component.position = value;
		return this.component.position;
	}

	public quaternion(value?: Quaternion) {
		if (value) this.component.quaternion = value;
		return this.component.quaternion;
	}

	public enabled$() {
		return this.controller.enable$;
	}
}
