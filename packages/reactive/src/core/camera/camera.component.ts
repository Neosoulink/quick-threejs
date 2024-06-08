import { singleton } from "tsyringe";
import { Euler, Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three";

@singleton()
export class CameraComponent {
	private readonly _camera: PerspectiveCamera;
	private readonly _rotation = new Object3D();
	private readonly _direction = new Vector3();

	constructor() {
		this._camera = new PerspectiveCamera(70, 1, 0.0001, 1000);
		this._camera.position.copy(new Vector3(0, 2, -5));
		this._camera.lookAt(new Vector3());
	}

	public get camera() {
		return this._camera;
	}

	public get objectRotation() {
		return this._rotation;
	}

	public get direction(): Vector3 {
		return this._direction
			.set(0, 0, 1)
			.applyQuaternion(this._rotation.quaternion);
	}

	public get rotation() {
		return this._rotation.rotation;
	}

	public set aspectRatio(ratio: number) {
		this._camera.aspect = ratio;
		this._camera.updateProjectionMatrix();
	}

	public set quaternion(quaternion: Quaternion) {
		this._camera.quaternion.copy(quaternion);
	}

	public set position(position: Vector3) {
		this._camera.position.copy(position);
	}

	public set rotation(rotation: Euler) {
		this._rotation.setRotationFromEuler(rotation);
	}
}
