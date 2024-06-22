import { inject, singleton } from "tsyringe";
import { filter, Observable } from "rxjs";
import { Vector2Like } from "three";

import { CoreController } from "../core.controller";
import { SizesComponent } from "./sizes.component";

@singleton()
export class SizesController {
	public readonly resize$: Observable<Vector2Like>;

	constructor(
		@inject(CoreController) private readonly coreController: CoreController,
		@inject(SizesComponent) private readonly component: SizesComponent
	) {
		this.resize$ = this.coreController.resize$.pipe(
			filter(() => this.component.enabled)
		);
	}
}
