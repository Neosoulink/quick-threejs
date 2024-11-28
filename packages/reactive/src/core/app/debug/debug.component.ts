import { inject, singleton } from "tsyringe";
import { AxesHelper, Camera, CameraHelper, GridHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { CameraComponent } from "../camera/camera.component";
import { AppComponent } from "../app.component";
import { WorldComponent } from "../world/world.component";

@singleton()
export class DebugComponent {
	public enabled = true;
	public cameraControls?: OrbitControls;
	public miniCameraControls?: OrbitControls;
	public cameraHelper?: CameraHelper;
	public axesHelper?: AxesHelper;
	public gridHelper?: GridHelper;

	constructor(
		@inject(AppComponent) private readonly appComponent: AppComponent,
		@inject(CameraComponent) private readonly cameraComponent: CameraComponent,
		@inject(WorldComponent) private readonly worldComponent: WorldComponent
	) {}

	private _setCameraOrbitControl() {
		if (this.cameraControls) {
			this.cameraControls?.dispose();
			this.cameraControls = undefined;
		}

		if (!this.enabled || !(this.cameraComponent.instance instanceof Camera))
			return;

		if (this.cameraComponent.instance instanceof Camera) {
			this.cameraControls = new OrbitControls(
				this.cameraComponent.instance,
				this.appComponent.proxyReceiver as unknown as HTMLElement
			);

			if (this.cameraControls) this.cameraControls.enableDamping = true;
		}
	}

	private _setMiniCameraOrbitControls() {
		if (this.miniCameraControls) {
			this.miniCameraControls.dispose();
			this.miniCameraControls = undefined;
		}

		if (!this.enabled) return;

		if (this.cameraComponent.miniCamera) {
			this.miniCameraControls = new OrbitControls(
				this.cameraComponent.miniCamera,
				this.appComponent.proxyReceiver as unknown as HTMLElement
			);
			this.miniCameraControls.enableDamping = true;
		}
	}

	private _setCameraHelper() {
		if (this.cameraHelper) {
			this.worldComponent.scene.remove(this.cameraHelper);
			this.cameraHelper = undefined;
		}

		if (!this.enabled) return;

		if (this.cameraComponent.instance) {
			this.cameraHelper = new CameraHelper(this.cameraComponent.instance);
			this.worldComponent.scene.add(this.cameraHelper);
		}
	}

	private _setAxesHelper(axesSizes: number) {
		const axesHelper = new AxesHelper(axesSizes);
		this.worldComponent.scene.add(axesHelper);
	}

	private _setGridHelper(gridSizes: number) {
		const axesHelper = new GridHelper(gridSizes, gridSizes);
		this.worldComponent.scene.add(axesHelper);
	}

	public init(props?: { axesSizes?: number; gridSizes?: number }) {
		this._setCameraOrbitControl();
		this._setMiniCameraOrbitControls();
		this._setCameraHelper();
		if (typeof props?.axesSizes === "number")
			this._setAxesHelper(props.axesSizes);
		if (typeof props?.gridSizes === "number")
			this._setGridHelper(props.gridSizes);
	}

	public update() {
		if (!this.enabled) return;
		this.cameraControls?.update();
		this.miniCameraControls?.update();
	}

	public dispose() {
		if (this.cameraHelper) {
			this.worldComponent.scene.remove(this.cameraHelper);
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
