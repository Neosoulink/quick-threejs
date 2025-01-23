import { inject, Lifecycle, scoped } from "tsyringe";
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

@scoped(Lifecycle.ContainerScoped)
export class CameraService {
	public instance?: Camera;
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

	public init(cameraType?: DefaultCameraType) {
		this.dispose();

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

	public dispose() {
		if (!(this.instance instanceof Camera)) return;
		if (
			this.instance instanceof PerspectiveCamera ||
			this.instance instanceof OrthographicCamera
		)
			this.instance.clearViewOffset();
		this.instance.clear();
		this.instance = undefined;
	}
}
