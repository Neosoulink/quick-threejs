import { inject, singleton } from "tsyringe";

import { WorldComponent } from "./world.component";
import { WorldController } from "./world.controller";

import { Module } from "../../../common/interfaces/module.interface";
import { Scene } from "three";

@singleton()
export class WorldModule implements Module {
	constructor(
		@inject(WorldComponent) private readonly component: WorldComponent,
		@inject(WorldController) private readonly controller: WorldController
	) {
		this.controller;
	}

	public init() {
		this.controller.enable$.subscribe((status) => {
			this.component.enabled = !!status;
		});
	}

	public dispose() {}

	public scene(value?: Scene) {
		if (value instanceof Scene) this.component.scene = value;
		return this.component.scene;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this.controller.enable$$.next(value);
		return this.component.enabled;
	}
}
