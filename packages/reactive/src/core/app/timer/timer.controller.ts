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

	public readonly animationCallback: FrameRequestCallback;

	constructor(
		@inject(TimerComponent) private readonly component: TimerComponent,
		@inject(AppController) private readonly appController: AppController
	) {
		this.animationCallback = this.animate.bind(this);
	}

	public animate() {
		this.appController.lifecycle$$.next(AppLifecycleState.UPDATE_STARTED);
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

		const animationFrameId = requestAnimationFrame(this.animationCallback);
		if (!this.component.enabled) cancelAnimationFrame(animationFrameId);
		this.appController.lifecycle$$.next(AppLifecycleState.UPDATE_ENDED);
	}
}
