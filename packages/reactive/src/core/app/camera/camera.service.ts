import { inject, singleton } from "tsyringe";
import {
	Camera,
	Euler,
	OrthographicCamera,
	PerspectiveCamera,
	Quaternion,
	Vector3
} from "three";
import { SizesService } from "../sizes/sizes.service";
import { DefaultCameraType } from "../../../common/enums/camera.enum";

@singleton()
export class CameraService {
	public instance?: Camera;
	public miniCamera?: PerspectiveCamera;
	public enabled = true;

	constructor(
		@inject(SizesService) private readonly _sizesService: SizesService
	) {}

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

	public initDefaultCamera(cameraType?: DefaultCameraType) {
		this.removeCamera();

		if (
			cameraType === DefaultCameraType.PERSPECTIVE ||
			cameraType === undefined
		) {
			this.instance = new PerspectiveCamera(
				70,
				this._sizesService.width / this._sizesService.height,
				0.0001,
				100
			);

			this.instance.position.z = 8;
			return;
		}

		if (cameraType === DefaultCameraType.ORTHOGRAPHIC) {
			this.instance = new OrthographicCamera(
				(-this._sizesService.aspect * this._sizesService.frustrum) / 2,
				(this._sizesService.aspect * this._sizesService.frustrum) / 2,
				this._sizesService.frustrum / 2,
				-this._sizesService.frustrum / 2,
				-50,
				50
			);
		}
	}

	public setMiniCamera() {
		this.removeMiniCamera();

		this.miniCamera = new PerspectiveCamera(
			75,
			this._sizesService.width / this._sizesService.height,
			0.1,
			500
		);
		this.miniCamera.position.z = 10;
		this.miniCamera.position.x = -5;
	}

	public removeCamera() {
		if (!(this.instance instanceof Camera)) return;
		if (
			this.instance instanceof PerspectiveCamera ||
			this.instance instanceof OrthographicCamera
		)
			this.instance.clearViewOffset();
		this.instance.clear();
		this.instance = undefined;
	}

	public removeMiniCamera() {
		if (!(this.miniCamera instanceof Camera)) return;
		this.miniCamera.clearViewOffset();
		this.miniCamera.clear();
		this.miniCamera = undefined;
	}
}
