import { inject, singleton } from "tsyringe";
import { TimerController } from "../timer/timer.controller";

@singleton()
export class DebugController {
	public step$: TimerController["step$"];

	constructor(
		@inject(TimerController) private readonly timerController: TimerController
	) {
		this.step$ = this.timerController.step$;
	}
}
