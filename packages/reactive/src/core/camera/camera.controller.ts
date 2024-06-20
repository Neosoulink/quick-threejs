import { inject, singleton } from "tsyringe";
import { Subject } from "rxjs";
import { Euler, Quaternion } from "three";

import { CameraComponent } from "./camera.component";
@singleton()
export class CameraController {
	private readonly quaternion$$ = new Subject<Quaternion>();

	public readonly quaternion$ = this.quaternion$$.pipe();

	constructor(
		@inject(CameraComponent) private readonly component: CameraComponent
	) {}

	private updateQuaternion() {
		if (this.component.instance)
			this.quaternion$$.next(this.component.instance.quaternion);
	}

	public setRotation(rotation: Euler) {
		this.component.rotation = rotation;
		this.updateQuaternion();
	}
}
