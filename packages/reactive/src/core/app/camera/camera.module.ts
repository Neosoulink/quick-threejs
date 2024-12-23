import { inject, singleton } from "tsyringe";
import {
	Camera,
	OrthographicCamera,
	PerspectiveCamera,
	Quaternion,
	Vector3
} from "three";

import { CameraService } from "./camera.service";
import { CameraController } from "./camera.controller";
import { SizesService } from "../sizes/sizes.service";
import type { Module } from "../../../common/interfaces/module.interface";

@singleton()
export class CameraModule implements Module {
	constructor(
		@inject(SizesService) private readonly _sizesService: SizesService,
		@inject(CameraController) private readonly _controller: CameraController,
		@inject(CameraService) private readonly _service: CameraService
	) {}

	public init(withMiniCamera?: boolean) {
		this._service.initDefaultCamera();
		if (withMiniCamera) this._service.setMiniCamera();

		this._controller.step$.subscribe(() => {
			if (!this._service.enabled) return;
			this._service.aspectRatio = this._sizesService.aspect;

			if (
				this._service.instance instanceof PerspectiveCamera ||
				this._service.instance instanceof OrthographicCamera
			)
				this._service.instance?.updateProjectionMatrix();
			this._service.miniCamera?.updateProjectionMatrix();
		});
	}

	public dispose() {
		this._service.removeCamera();
		this._service.removeMiniCamera();
	}

	public aspectRatio(value?: number) {
		if (value) this._service.aspectRatio = value;
		return this._service.aspectRatio;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public instance(value?: Camera) {
		if (value) this._service.instance = value;
		return this._service.instance;
	}

	public miniCamera(value?: PerspectiveCamera) {
		if (value) this._service.miniCamera = value;
		return this._service.miniCamera;
	}

	public position(value?: Vector3) {
		if (value) this._service.position = value;
		return this._service.position;
	}

	public quaternion(value?: Quaternion) {
		if (value) this._service.quaternion = value;
		return this._service.quaternion;
	}
}
