import { inject, singleton } from "tsyringe";
import { Observable, Subject } from "rxjs";
import { Euler, Quaternion } from "three";

import { CameraComponent } from "./camera.component";
import { TimerController } from "../timer/timer.controller";
import { SizesController } from "../sizes/sizes.controller";
import { StepPayload } from "../../common/interfaces/event.interface";

@singleton()
export class CameraController {
	private readonly quaternionSubject = new Subject<Quaternion>();

	public readonly quaternion$ = this.quaternionSubject.pipe();
	public readonly step$: Observable<StepPayload>;
	public readonly aspect$: Observable<number>;

	constructor(
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(SizesController) private readonly sizeController: SizesController,
		@inject(CameraComponent) private readonly component: CameraComponent
	) {
		this.step$ = this.timerController.step$;
		this.aspect$ = this.sizeController.aspect$;

		this.updateQuaternion();
	}

	private updateQuaternion() {
		this.quaternionSubject.next(this.component.objectRotation.quaternion);
	}

	public setRotation(rotation: Euler) {
		this.component.rotation = rotation;
		this.updateQuaternion();
	}
}
