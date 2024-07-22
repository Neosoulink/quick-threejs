import { inject, singleton } from "tsyringe";

import { DebugComponent } from "./debug.component";
import { DebugController } from "./debug.controller";

import { Module } from "../../../common/interfaces/module.interface";

@singleton()
export class DebugModule implements Module {
	constructor(
		@inject(DebugComponent) public readonly component: DebugComponent,
		@inject(DebugController) public readonly controller: DebugController
	) {
		this.controller.step$.subscribe(() => {
			this.component.update();
		});
	}

	public init(props?: Parameters<DebugComponent["init"]>[0]) {
		this.component.init(props);
	}

	public dispose() {
		this.component.dispose();
	}

	public axesHelper() {
		return this.component.axesHelper;
	}

	public cameraControls() {
		return this.component.cameraControls;
	}

	public cameraHelper() {
		return this.component.cameraHelper;
	}

	public enabled(value?: boolean) {
		if (value) this.component.enabled = value;
		return this.component.enabled;
	}

	public gridHelper() {
		return this.component.gridHelper;
	}

	public miniCameraControls() {
		return this.component.miniCameraControls;
	}

	public enabled$() {
		return this.controller.enable$;
	}
}
