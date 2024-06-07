import { inject, singleton } from "tsyringe";
import { Observable, Subject } from "rxjs";

import { CoreController } from "../core.controller";
import { EventStatus } from "../../common/interfaces/event.interface";
import { TimerComponent } from "./timer.component";

@singleton()
export class TimerController {
	private readonly _stepSubject = new Subject<number>();
	private readonly _bindStep: FrameRequestCallback;

	public readonly pointerLock$: Observable<EventStatus>;
	public readonly step$ = this._stepSubject.pipe();

	constructor(
		@inject(CoreController) private readonly coreController: CoreController,
		@inject(TimerComponent) private readonly timerComponent: TimerComponent
	) {
		this.pointerLock$ = this.coreController.pointerLock$;
		this._bindStep = this.step.bind(this);

		this.step();
	}

	private step(): void {
		this.timerComponent.delta =
			this.timerComponent.clock.getDelta() ?? this.timerComponent.frame;

		if (this.timerComponent.enabled) {
			this.timerComponent.deltaRatio =
				(this.timerComponent.delta * 1000) / this.timerComponent.frame;
			this._stepSubject.next(this.timerComponent.deltaRatio);
		}

		requestAnimationFrame(this._bindStep);
	}
}
