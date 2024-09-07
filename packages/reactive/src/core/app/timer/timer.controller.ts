import { inject, singleton } from "tsyringe";
import { Subject } from "rxjs";

import { TimerComponent } from "./timer.component";
import { StepPayload } from "../../../common/interfaces/event.interface";
import { AppController } from "../app.controller";
import { AppLifecycleState } from "../../../common/enums/lifecycle.enum";

@singleton()
export class TimerController {
	public readonly step$$ = new Subject<StepPayload>();
	public readonly enable$$ = new Subject<boolean>();
	public readonly step$ = this.step$$.pipe();
	public readonly enable$ = this.enable$$.pipe();

	constructor(
		@inject(TimerComponent) private readonly component: TimerComponent,
		@inject(AppController) private readonly appController: AppController
	) {}

	public step() {
		this.appController.lifecycle$$.next(AppLifecycleState.STEP_STARTED);

		if (this.component.enabled) {
			this.component.delta =
				this.component.clock.getDelta() ?? this.component.frame;

			this.component.deltaRatio =
				(this.component.delta * 1000) / this.component.frame;

			this.step$$.next({
				delta: this.component.delta,
				deltaRatio: this.component.deltaRatio
			});
		}

		this.appController.lifecycle$$.next(AppLifecycleState.STEP_ENDED);
	}
}
