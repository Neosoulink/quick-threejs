import { Subscription } from "rxjs";
import { PerspectiveCamera } from "three";
import { inject, singleton } from "tsyringe";

import { Module, AppModulePropsMessageEvent } from "../../../common";

import { DebugService } from "./debug.service";
import { DebugController } from "./debug.controller";

@singleton()
export class DebugModule implements Module {
	private readonly _subscriptions: Subscription[] = [];

	constructor(
		@inject(DebugService) public readonly _service: DebugService,
		@inject(DebugController) public readonly _controller: DebugController
	) {}

	public init(props: AppModulePropsMessageEvent["data"]) {
		this._service.enabled = !!props.enableDebug;

		if (!this._service.enabled) return;

		if (props.withMiniCamera) this._service.initMiniCamera();

		if (props.enableControls) {
			this._service.initOrbitControl();
			this._service.initMiniCameraOrbitControls();
		}

		if (props.withCameraHelper) this._service.initCameraHelper();

		if (typeof props?.axesSizes === "number")
			this._service.initAxesHelper(props.axesSizes);

		if (typeof props?.gridSizes === "number")
			this._service.initGridHelper(props.gridSizes);

		this._subscriptions.push(
			this._controller.step$.subscribe(() => {
				this._service.update();
			})
		);
	}

	public enabled(value?: boolean) {
		if (value) this._service.enabled = value;
		return this._service.enabled;
	}

	public miniCamera(value?: PerspectiveCamera) {
		if (value) this._service.miniCamera = value;
		return this._service.miniCamera;
	}

	public getAxesHelper() {
		return this._service.axesHelper;
	}

	public getCameraControls() {
		return this._service.cameraControls;
	}

	public getCameraHelper() {
		return this._service.cameraHelper;
	}

	public getGridHelper() {
		return this._service.gridHelper;
	}

	public getMiniCameraControls() {
		return this._service.miniCameraControls;
	}

	public getStep$() {
		return this._controller.step$;
	}

	public dispose() {
		this._service.dispose();
		this._subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
