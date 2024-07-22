import { inject, singleton } from "tsyringe";
import { filter, Observable, Subject } from "rxjs";

import { AppController } from "../app.controller";
import { SizesComponent } from "./sizes.component";

@singleton()
export class SizesController {
	public readonly enable$$ = new Subject<boolean>();

	public readonly enable$ = this.enable$$.pipe();
	public readonly resize$: Observable<Event>;

	constructor(
		@inject(AppController) private readonly appController: AppController,
		@inject(SizesComponent) private readonly component: SizesComponent
	) {
		this.resize$ = this.appController.resize$$.pipe(
			filter(() => this.component.enabled)
		);
	}
}
