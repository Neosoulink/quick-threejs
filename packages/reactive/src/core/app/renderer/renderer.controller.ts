import { inject, singleton } from "tsyringe";
import { filter, Observable, Subject } from "rxjs";

import type { ProxyEvent, StepPayload } from "common";
import { SizesController } from "../sizes/sizes.controller";
import { TimerController } from "../timer/timer.controller";
import { RendererComponent } from "./renderer.component";

@singleton()
export class RendererController {
	public readonly enable$$ = new Subject<boolean>();

	public readonly enable$ = this.enable$$.pipe();
	public readonly step$: Observable<StepPayload>;
	public readonly resize$: Observable<UIEvent & ProxyEvent>;

	constructor(
		@inject(RendererComponent)
		private readonly rendererComponent: RendererComponent,
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(SizesController) private readonly sizesController: SizesController
	) {
		this.step$ = this.timerController.step$.pipe(
			filter(() => this.rendererComponent.enabled)
		);

		this.resize$ = this.sizesController.resize$.pipe(
			filter(() => this.rendererComponent.enabled)
		);
	}
}
