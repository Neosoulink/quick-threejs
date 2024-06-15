import { inject, singleton } from "tsyringe";

import { WorldComponent } from "./world.component";
import { WorldController } from "./world.controller";

@singleton()
export class WorldModule {
	constructor(
		@inject(WorldComponent) private readonly component: WorldComponent,
		@inject(WorldController) private readonly controller: WorldController
	) {}

	public get scene() {
		return this.component.scene;
	}
}
