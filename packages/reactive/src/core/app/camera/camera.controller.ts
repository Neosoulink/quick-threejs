import { inject, singleton } from "tsyringe";
import { filter, Observable, Subject } from "rxjs";

import { CameraComponent } from "./camera.component";
import { TimerController } from "../timer/timer.controller";
import type { StepPayload } from "../../../common/interfaces/event.interface";
@singleton()
export class CameraController {
	public readonly enable$$ = new Subject<boolean>();

	public readonly enable$ = this.enable$$.pipe();
	public readonly step$: Observable<StepPayload>;

	constructor(
		@inject(CameraComponent) private readonly component: CameraComponent,
		@inject(TimerController) private readonly timerController: TimerController
	) {
		this.step$ = this.timerController.step$.pipe(
			filter(() => this.component.enabled)
		);
	}
}
