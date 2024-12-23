import { inject, singleton } from "tsyringe";
import { AxesHelper, Camera, CameraHelper, GridHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { CameraService } from "../camera/camera.service";
import { AppService } from "../app.service";
import { WorldService } from "../world/world.service";

@singleton()
export class DebugService {
	public enabled = true;
	public cameraControls?: OrbitControls;
	public miniCameraControls?: OrbitControls;
	public cameraHelper?: CameraHelper;
	public axesHelper?: AxesHelper;
	public gridHelper?: GridHelper;

	constructor(
		@inject(AppService) private readonly _appService: AppService,
		@inject(CameraService) private readonly _cameraService: CameraService,
		@inject(WorldService) private readonly _worldService: WorldService
	) {}

	private _setCameraOrbitControl() {
		if (this.cameraControls) {
			this.cameraControls?.dispose();
			this.cameraControls = undefined;
		}

		if (!this.enabled || !(this._cameraService.instance instanceof Camera))
			return;

		if (this._cameraService.instance instanceof Camera) {
			this.cameraControls = new OrbitControls(
				this._cameraService.instance,
				this._appService.proxyReceiver as unknown as HTMLElement
			);

			this.cameraControls.rotateSpeed = 0.1;
			this.cameraControls.enableDamping = true;
		}
	}

	private _setMiniCameraOrbitControls() {
		if (this.miniCameraControls) {
			this.miniCameraControls.dispose();
			this.miniCameraControls = undefined;
		}

		if (!this.enabled || !this._cameraService.miniCamera) return;

		this.miniCameraControls = new OrbitControls(
			this._cameraService.miniCamera,
			this._appService.proxyReceiver as unknown as HTMLElement
		);
		this.miniCameraControls.rotateSpeed = 0.15;
		this.miniCameraControls.enableDamping = true;
	}

	private _setCameraHelper() {
		if (this.cameraHelper) {
			this._worldService.scene.remove(this.cameraHelper);
			this.cameraHelper = undefined;
		}

		if (!this.enabled) return;

		if (this._cameraService.instance) {
			this.cameraHelper = new CameraHelper(this._cameraService.instance);
			this._worldService.scene.add(this.cameraHelper);
		}
	}

	private _setAxesHelper(axesSizes: number) {
		const axesHelper = new AxesHelper(axesSizes);
		this._worldService.scene.add(axesHelper);
	}

	private _setGridHelper(gridSizes: number) {
		const axesHelper = new GridHelper(gridSizes, gridSizes);
		this._worldService.scene.add(axesHelper);
	}

	public activate(props?: { axesSizes?: number; gridSizes?: number }) {
		this._setCameraOrbitControl();
		this._setMiniCameraOrbitControls();
		this._setCameraHelper();
		if (typeof props?.axesSizes === "number")
			this._setAxesHelper(props.axesSizes);
		if (typeof props?.gridSizes === "number")
			this._setGridHelper(props.gridSizes);
	}

	public update() {
		this.cameraControls?.update();
		this.miniCameraControls?.update();
	}

	public deactivate() {
		if (this.cameraHelper) {
			this._worldService.scene.remove(this.cameraHelper);
			this.cameraHelper = undefined;
		}

		if (this.cameraControls) {
			this.cameraControls.dispose();
			this.cameraControls = undefined;
		}

		if (this.miniCameraControls) {
			this.miniCameraControls.dispose();
			this.miniCameraControls = undefined;
		}
	}
}
