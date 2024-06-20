import { singleton } from "tsyringe";
import {
	Camera,
	Euler,
	OrthographicCamera,
	PerspectiveCamera,
	Quaternion,
	Vector3
} from "three";

import { EventStatus } from "../../common/enums/event.enum";

@singleton()
export class CameraComponent {
	public instance?: Camera;
	public miniCamera?: PerspectiveCamera;
	public enabled?: EventStatus.ON;

	public set aspectRatio(ratio: number) {
		if (this.instance instanceof PerspectiveCamera)
			this.instance.aspect = ratio;
		if (
			this.instance instanceof PerspectiveCamera ||
			this.instance instanceof OrthographicCamera
		)
			this.instance?.updateProjectionMatrix();
	}

	public set quaternion(quaternion: Quaternion) {
		this.instance?.quaternion.copy(quaternion);
	}

	public set position(position: Vector3) {
		this.instance?.position.copy(position);
	}

	public set rotation(rotation: Euler) {
		this.instance?.rotation.copy(rotation);
	}
}
