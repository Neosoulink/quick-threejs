import { inject, singleton } from "tsyringe";
import { filter } from "rxjs";

import { CameraService } from "./camera.service";
import { TimerController } from "../timer/timer.controller";

@singleton()
export class CameraController {
	public readonly step$: TimerController["step$"];

	constructor(
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(CameraService) private readonly _service: CameraService
	) {
		this.step$ = this.timerController.step$.pipe(
			filter(() => this._service.enabled)
		);
	}
}
