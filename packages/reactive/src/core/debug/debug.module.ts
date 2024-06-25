import { inject, singleton } from "tsyringe";

import { DebugComponent } from "./debug.component";
import { DebugController } from "./debug.controller";

import { Module } from "../../common/interfaces/module.interface";

@singleton()
export class DebugModule implements Module {
	constructor(
		@inject(DebugComponent) public readonly component: DebugComponent,
		@inject(DebugController) public readonly controller: DebugController
	) {}

	public init() {
		this.component.setCameraOrbitControl();
	}

	dispose() {
		throw new Error("Method not implemented.");
	}
}
