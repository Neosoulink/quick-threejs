import { inject, singleton } from "tsyringe";

import { Module } from "../../../common/interfaces/module.interface";

import { DebugService } from "./debug.service";
import { DebugController } from "./debug.controller";

@singleton()
export class DebugModule implements Module {
	constructor(
		@inject(DebugService) public readonly _service: DebugService,
		@inject(DebugController) public readonly _controller: DebugController
	) {
		this._controller.step$.subscribe(() => {
			this._service.update();
		});
	}

	public step$() {
		return this._controller.step$;
	}

	public init(props?: Parameters<DebugService["activate"]>[0]) {
		this._service.activate(props);
	}

	public axesHelper() {
		return this._service.axesHelper;
	}

	public cameraControls() {
		return this._service.cameraControls;
	}

	public cameraHelper() {
		return this._service.cameraHelper;
	}

	public enabled(value?: boolean) {
		if (value) this._service.enabled = value;
		return this._service.enabled;
	}

	public gridHelper() {
		return this._service.gridHelper;
	}

	public miniCameraControls() {
		return this._service.miniCameraControls;
	}

	public dispose() {
		this._service.deactivate();
	}
}
