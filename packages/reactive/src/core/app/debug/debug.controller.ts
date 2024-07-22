import { inject, singleton } from "tsyringe";
import { Subject } from "rxjs";

import { TimerController } from "../timer/timer.controller";

@singleton()
export class DebugController {
	public readonly enable$$ = new Subject<boolean>();

	public readonly enable$ = this.enable$$.pipe();
	public readonly step$: TimerController["step$"];

	constructor(
		@inject(TimerController) private readonly timerController: TimerController
	) {
		this.step$ = this.timerController.step$;
	}
}
