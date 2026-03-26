import { Subscription } from "rxjs";
import type { Camera, Quaternion, Vector3 } from "three";
import { inject, Lifecycle, scoped } from "tsyringe";

import type { Module } from "@/common";
import { CameraService } from "./camera.service";
import { CameraController } from "./camera.controller";

@scoped(Lifecycle.ContainerScoped)
export class CameraModule implements Module {
	private _subscriptions: Subscription[] = [];

	constructor(
		@inject(CameraController) private readonly _controller: CameraController,
		@inject(CameraService) private readonly _service: CameraService
	) {}

	public init() {
		this._service.init();

		this._subscriptions.push(
			this._controller.step$.subscribe(
				this._service.handleStep.bind(this._service)
			)
		);
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public aspectRatio(value?: number) {
		if (value) this._service.aspectRatio = value;
		return this._service.aspectRatio;
	}

	public instance(value?: Camera) {
		if (value) this._service.instance = value;
		return this._service.instance;
	}

	public position(value?: Vector3) {
		if (value) this._service.position = value;
		return this._service.position;
	}

	public quaternion(value?: Quaternion) {
		if (value) this._service.quaternion = value;
		return this._service.quaternion;
	}

	public dispose() {
		this._subscriptions.forEach((sub) => sub.unsubscribe());
		this._subscriptions = [];
		this._service.dispose();
	}
}
