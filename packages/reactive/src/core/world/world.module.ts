import { inject, singleton } from "tsyringe";

import { WorldComponent } from "./world.component";
import { WorldController } from "./world.controller";

import { Module } from "../../common/interfaces/module.interface";

@singleton()
export class WorldModule implements Module {
	constructor(
		@inject(WorldComponent) private readonly component: WorldComponent,
		@inject(WorldController) private readonly controller: WorldController
	) {}

	init() {}

	dispose() {}
}
