import { inject, singleton } from "tsyringe";
import { Subject } from "rxjs";

import { TimerComponent } from "./timer.component";
import { EventStatus } from "../../common/enums/event.enum";
import { StepPayload } from "../../common/interfaces/event.interface";

@singleton()
export class TimerController {
	private readonly _step$$ = new Subject<StepPayload>();
	private readonly _enable$$ = new Subject<EventStatus>();
	private readonly _animationCallback: FrameRequestCallback;

	public readonly step$ = this._step$$.pipe();
	public readonly enable$ = this._enable$$.pipe();

	constructor(
		@inject(TimerComponent) private readonly component: TimerComponent
	) {
		this._animationCallback = this.animate.bind(this);
	}

	public get enable$$() {
		return this._enable$$;
	}

	public animate() {
		if (this.component.enabled) {
			this.component.delta =
				this.component.clock.getDelta() ?? this.component.frame;
			console.log(this.component.clock.getDelta());

			this.component.deltaRatio =
				(this.component.delta * 1000) / this.component.frame;

			this._step$$.next({
				delta: this.component.delta,
				deltaRatio: this.component.deltaRatio
			});
		}

		const animationFrameId = requestAnimationFrame(this._animationCallback);
		if (this.component.enabled === EventStatus.OFF)
			cancelAnimationFrame(animationFrameId);
	}
}
