import { inject, Lifecycle, scoped } from "tsyringe";
import { AxesHelper, Camera, GridHelper, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { CameraService } from "../camera/camera.service";
import { AppService } from "../app.service";
import { WorldService } from "../world/world.service";
import { SizesService } from "../sizes/sizes.service";
import { RendererService } from "../renderer/renderer.service";

@scoped(Lifecycle.ContainerScoped)
export class DebugService {
	public enabled = false;
	public cameraControls?: OrbitControls;
	public miniCamera?: PerspectiveCamera;
	public miniCameraControls?: OrbitControls;
	public axesHelper?: AxesHelper;
	public gridHelper?: GridHelper;

	constructor(
		@inject(AppService) private readonly _appService: AppService,
		@inject(SizesService) private readonly _sizesService: SizesService,
		@inject(RendererService) private readonly _rendererService: RendererService,
		@inject(CameraService) private readonly _cameraService: CameraService,
		@inject(WorldService) private readonly _worldService: WorldService
	) {}

	private _renderMiniCamera() {
		if (!this.enabled || !this.miniCamera) return;

		this._rendererService.instance?.setScissorTest(true);
		this._rendererService.instance?.setViewport(
			this._sizesService.width - this._sizesService.width / 3,
			this._sizesService.height - this._sizesService.height / 3,
			this._sizesService.width / 3,
			this._sizesService.height / 3
		);
		this._rendererService.instance?.setScissor(
			this._sizesService.width - this._sizesService.width / 3,
			this._sizesService.height - this._sizesService.height / 3,
			this._sizesService.width / 3,
			this._sizesService.height / 3
		);
		this._rendererService.instance?.render(
			this._worldService.scene,
			this.miniCamera
		);
		this._rendererService.instance?.setScissorTest(false);
	}

	public initMiniCamera() {
		this.disposeMiniCamera();

		if (!this.enabled) return;

		this.miniCamera = new PerspectiveCamera(
			75,
			this._sizesService.width / this._sizesService.height,
			0.1,
			500
		);
		this.miniCamera.position.z = 10;
		this.miniCamera.position.x = -5;
	}

	public initOrbitControl() {
		if (this.cameraControls) this.cameraControls?.dispose();

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

	public initMiniCameraOrbitControls() {
		if (this.miniCameraControls) this.miniCameraControls.dispose();

		if (!this.enabled || !this.miniCamera) return;

		this.miniCameraControls = new OrbitControls(
			this.miniCamera,
			this._appService.proxyReceiver as unknown as HTMLElement
		);
		this.miniCameraControls.rotateSpeed = 0.15;
		this.miniCameraControls.enableDamping = true;
	}

	public initAxesHelper(axesSizes: number) {
		if (!this.enabled) return;

		this.axesHelper = new AxesHelper(axesSizes);
		this._worldService.scene.add(this.axesHelper);
	}

	public initGridHelper(gridSizes: number) {
		if (this.gridHelper) {
			this._worldService.scene.remove(this.gridHelper);
		}

		if (!this.enabled) return;

		this.gridHelper = new GridHelper(gridSizes, gridSizes);
		this._worldService.scene.add(this.gridHelper);
	}

	public disposeMiniCamera() {
		if (!(this.miniCamera instanceof Camera)) return;

		this.miniCamera.clearViewOffset();
		this.miniCamera.clear();
		this.miniCamera = undefined;
	}

	public update() {
		this.cameraControls?.update();
		this.miniCameraControls?.update();
		this._renderMiniCamera();
	}

	public dispose() {
		this.disposeMiniCamera();

		this.cameraControls?.dispose();
		this.cameraControls = undefined;

		this.miniCameraControls?.dispose();
		this.miniCameraControls = undefined;

		if (this.axesHelper) this._worldService.scene.remove(this.axesHelper);
		this.axesHelper?.dispose();
		this.axesHelper = undefined;

		if (this.gridHelper) this._worldService.scene.remove(this.gridHelper);
		this.gridHelper?.dispose();
		this.gridHelper = undefined;
	}
}
