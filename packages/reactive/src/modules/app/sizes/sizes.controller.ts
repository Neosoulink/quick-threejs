import { inject, singleton } from "tsyringe";
import { filter, Observable } from "rxjs";
import { Vector2Like } from "three";

import { AppController } from "../app.controller";
import { SizesComponent } from "./sizes.component";

@singleton()
export class SizesController {
	public readonly resize$: Observable<Vector2Like>;

	constructor(
		@inject(AppController) private readonly appController: AppController,
		@inject(SizesComponent) private readonly component: SizesComponent
	) {
		this.resize$ = this.appController.resize$$.pipe(
			filter(() => this.component.enabled)
		);
	}
}
