import { inject, singleton } from "tsyringe";
import { Observable, Subject } from "rxjs";
import { Euler, Object3D, Quaternion, Vector2, Vector3 } from "three";

import { CoreController } from "../core.controller";

@singleton()
export class CameraController {
	private readonly quaternionSubject = new Subject<Quaternion>();
	private readonly object = new Object3D();
	private readonly direction = new Vector3();

	public readonly quaternion$ = this.quaternionSubject.pipe();
	public readonly resize$: Observable<Vector2>;
	public readonly mouseMove$: Observable<Vector2>;

	constructor(
		@inject(CoreController) private readonly coreController: CoreController
	) {
		this.resize$ = this.coreController.resize$;
		this.mouseMove$ = this.coreController.mouseMove$;

		this.object.rotation.order = "YXZ";
		this.update();
	}

	public getDirection(): Vector3 {
		return this.direction.set(0, 0, 1).applyQuaternion(this.object.quaternion);
	}

	public getRotation() {
		return this.object.rotation;
	}

	public setRotation(rotation: Euler): void {
		this.object.setRotationFromEuler(rotation);
		this.update();
	}

	private update(): void {
		this.quaternionSubject.next(this.object.quaternion);
	}
}
