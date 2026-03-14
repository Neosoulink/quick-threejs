import { inject, Lifecycle, scoped } from "tsyringe";
import { Scene } from "three";

import { type Module } from "@/common";
import { WorldService } from "./world.service";
import { WorldController } from "./world.controller";

@scoped(Lifecycle.ContainerScoped)
export class WorldModule implements Module {
	constructor(
		@inject(WorldService) private readonly _service: WorldService,
		@inject(WorldController) private readonly _controller: WorldController
	) {}

	public init() {}

	public dispose() {}

	public scene(value?: Scene) {
		if (value instanceof Scene) this._service.scene = value;
		return this._service.scene;
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public getBeforeRender$() {
		return this._controller.beforeRender$;
	}

	public getAfterRender$() {
		return this._controller.afterRender$;
	}
}
