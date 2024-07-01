import { inject, singleton } from "tsyringe";
import { filter, Observable } from "rxjs";

import { SizesController } from "../sizes/sizes.controller";
import { TimerController } from "../timer/timer.controller";
import type { StepPayload } from "../../../common/interfaces/event.interface";
import { RendererComponent } from "./renderer.component";

@singleton()
export class RendererController {
	public readonly step$: Observable<StepPayload>;
	public readonly resize$: Observable<Event>;

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
