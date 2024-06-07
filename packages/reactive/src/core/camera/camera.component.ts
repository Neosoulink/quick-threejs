import { singleton } from "tsyringe";
import { PerspectiveCamera, Quaternion, Vector3 } from "three";

@singleton()
export class CameraComponent {
	private readonly camera: PerspectiveCamera;

	constructor() {
		this.camera = new PerspectiveCamera(70, 1, 0.0001, 1000);
	}

	public getCamera(): PerspectiveCamera {
		return this.camera;
	}

	public setAspectRatio(ratio: number): void {
		this.camera.aspect = ratio;
		this.camera.updateProjectionMatrix();
	}

	public setQuaternion(quaternion: Quaternion): void {
		this.camera.quaternion.copy(quaternion);
	}

	public setPosition(position: Vector3): void {
		this.camera.position.copy(position);
	}
}
