import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "stats.js";

import { QuickThreejs } from "..";

export default class Debug {
	app = new QuickThreejs();
	active = false;
	gui?: GUI;
	stats?: Stats;
	cameraControls?: OrbitControls;
	miniCameraControls?: OrbitControls;
	cameraHelper?: THREE.CameraHelper;

	constructor(active?: boolean) {
		if (!active) return;

		this.active = active;
		this.gui = new GUI();
		this.stats = new Stats();
		this.stats.showPanel(0);
		this.setCameraOrbitControl();
		this.setMiniCameraOrbitControls();
		this.setCameraHelper();

		if (!window) return;

		window.document.body.appendChild(this.stats.dom);
		if (this.app.sizes.width <= 450) this.gui.close();
	}

	setCameraOrbitControl() {
		if (this.cameraControls) {
			this.cameraControls.dispose();
			this.cameraControls = undefined;
		}

		if (!this.active) return;

		if (this.app.camera.instance instanceof THREE.Camera) {
			this.cameraControls = new OrbitControls(
				this.app.camera.instance,
				this.app.canvas!
			);

			this.cameraControls.enableDamping = true;
		}
	}

	setMiniCameraOrbitControls() {
		if (this.miniCameraControls) {
			this.miniCameraControls.dispose();
			this.miniCameraControls = undefined;
		}

		if (!this.active) return;

		if (this.app.camera.miniCamera) {
			this.miniCameraControls = new OrbitControls(
				this.app.camera.miniCamera,
				this.app.canvas!
			);
			this.miniCameraControls.enableDamping = true;
		}
	}

	setCameraHelper() {
		if (this.cameraHelper) {
			this.app.scene.remove(this.cameraHelper);
			this.cameraHelper = undefined;
		}

		if (!this.active) return;

		if (this.app.camera.instance) {
			this.cameraHelper = new THREE.CameraHelper(this.app.camera.instance);
			this.app.scene.add(this.cameraHelper);
		}
	}

	update() {
		if (this.active) {
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
			this.app.scene.remove(this.cameraHelper);
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
