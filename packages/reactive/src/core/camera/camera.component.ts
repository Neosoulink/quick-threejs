import { inject, singleton } from "tsyringe";
import {
	Camera,
	Euler,
	OrthographicCamera,
	PerspectiveCamera,
	Quaternion,
	Vector3
} from "three";
import { SizesComponent } from "../sizes/sizes.component";
import { DefaultCameraType } from "../../common/enums/camera.enum";

@singleton()
export class CameraComponent {
	public instance?: Camera;
	public miniCamera?: PerspectiveCamera;
	public enabled = true;

	constructor(
		@inject(SizesComponent) private readonly sizesComponent: SizesComponent,
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

	public setDefaultCamera(cameraType?: DefaultCameraType) {
		this.removeCamera();

		if (cameraType === DefaultCameraType.PERSPECTIVE || cameraType === undefined) {
			this.instance = new PerspectiveCamera(
				70,
				this.sizesComponent.width / this.sizesComponent.height,
				0.0001,
				100
			);

			this.instance.position.z = 8;
			return;
		}

		if (cameraType === DefaultCameraType.ORTHOGRAPHIC) {
			this.instance = new OrthographicCamera(
				(-this.sizesComponent.aspect * this.sizesComponent.frustrum) / 2,
				(this.sizesComponent.aspect * this.sizesComponent.frustrum) / 2,
				this.sizesComponent.frustrum / 2,
				-this.sizesComponent.frustrum / 2,
				-50,
				50
			);
		}
	}

	public setMiniCamera() {
		this.removeMiniCamera();

		this.miniCamera = new PerspectiveCamera(
			75,
			this.sizesComponent.width / this.sizesComponent.height,
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
