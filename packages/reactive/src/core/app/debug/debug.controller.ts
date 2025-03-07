import { inject, Lifecycle, scoped } from "tsyringe";

import { TimerController } from "../timer/timer.controller";
import { filter } from "rxjs";
import { CameraService } from "../camera/camera.service";

@scoped(Lifecycle.ContainerScoped)
export class DebugController {
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
