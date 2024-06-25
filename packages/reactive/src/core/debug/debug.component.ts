import { inject, singleton } from "tsyringe";
import { Camera, CameraHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "stats.js";

import { CameraComponent } from "../camera/camera.component";
import { CoreComponent } from "../core.component";
import { WorldComponent } from "../world/world.component";

@singleton()
export class DebugComponent {
	public enabled = true;
	public gui?: GUI;
	public stats?: Stats;
	public cameraControls?: OrbitControls;
	public miniCameraControls?: OrbitControls;
	public cameraHelper?: CameraHelper;

	constructor(
		@inject(CoreComponent) private readonly coreComponent: CoreComponent,
		@inject(CameraComponent) private readonly cameraComponent: CameraComponent,
		@inject(WorldComponent) private readonly worldComponent: WorldComponent
	) {
		try {
			window;
		} catch (error) {
			// @ts-ignore
			self.document = {};
		}

		// this.stats = new Stats();
		// this.stats.showPanel(0);
		this.setCameraOrbitControl();
		this.setMiniCameraOrbitControls();
		this.setCameraHelper();
	}

	setCameraOrbitControl() {
		if (this.cameraControls) {
			this.cameraControls.dispose();
			this.cameraControls = undefined;
		}

		if (!this.enabled || !(this.cameraComponent.instance instanceof Camera))
			return;

		if (this.cameraComponent.instance instanceof Camera) {
			this.cameraControls = new OrbitControls(
				this.cameraComponent.instance,
				this.coreComponent.proxyReceiver as unknown as HTMLElement
			);

			this.cameraControls.enableDamping = true;
		}
	}

	setMiniCameraOrbitControls() {
		if (this.miniCameraControls) {
			this.miniCameraControls.dispose();
			this.miniCameraControls = undefined;
		}

		if (!this.enabled) return;

		if (this.cameraComponent.miniCamera) {
			this.miniCameraControls = new OrbitControls(
				this.cameraComponent.miniCamera,
				this.coreComponent.proxyReceiver as unknown as HTMLElement
			);
			this.miniCameraControls.enableDamping = true;
		}
	}

	setCameraHelper() {
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

	update() {
		if (this.enabled) {
			this.cameraControls?.update();
			this.miniCameraControls?.update();
		}
	}

	destruct() {
		this.gui?.destroy();
		this.gui = undefined;

		this.stats?.dom.remove();
		this.stats = undefined;

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
