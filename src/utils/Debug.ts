import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// CLASSES
import ThreeApp from "..";

export default class Debug {
	app = new ThreeApp();
	active = false;
	ui?: GUI;
	stats?: Stats;
	cameraControls?: OrbitControls;
	miniCameraControls?: OrbitControls;
	cameraHelper?: THREE.CameraHelper;

	constructor(active?: boolean) {
		if (!active) return;

		this.active = active;
		this.ui = new GUI();
		this.stats = new Stats();
		this.stats.showPanel(0);
		this.setCameraOrbitControl();
		this.setMiniCameraOrbitControls();
		this.setCameraHelper();

		if (!window) return;

		window.document.body.appendChild(this.stats.dom);
		if (window.innerWidth <= 450) this.ui.close();
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
				this.app.canvas
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
				this.app.canvas
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

	destroy() {
		this.ui?.destroy();
		this.ui = undefined;

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
