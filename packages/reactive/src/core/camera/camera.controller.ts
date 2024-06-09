import { inject, singleton } from "tsyringe";
import { Observable, Subject } from "rxjs";
import { Euler, Quaternion, Vector2 } from "three";

import { CoreController } from "../core.controller";
import { CameraComponent } from "./camera.component";
import { TimerController } from "../timer/timer.controller";
import { SizesController } from "../sizes/sizes.controller";

@singleton()
export class CameraController {
	private readonly quaternionSubject = new Subject<Quaternion>();

	public readonly quaternion$ = this.quaternionSubject.pipe();
	public readonly mouseMove$: Observable<Vector2>;
	public readonly step$: Observable<number>;
	public readonly aspect$: Observable<number>;

	constructor(
		@inject(CoreController) private readonly coreController: CoreController,
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(SizesController) private readonly sizeController: SizesController,
		@inject(CameraComponent) private readonly component: CameraComponent
	) {
		this.mouseMove$ = this.coreController.mouseMove$;
		this.step$ = this.timerController.step$;
		this.aspect$ = this.sizeController.aspect$;

		this.updateQuaternion();
	}

	private updateQuaternion(): void {
		this.quaternionSubject.next(this.component.objectRotation.quaternion);
	}

	public setRotation(rotation: Euler) {
		this.component.rotation = rotation;
		this.updateQuaternion();
	}
}
