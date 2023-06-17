import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// CLASSES
import ThreeApp from ".";

export interface CameraProps {
	enableControls: boolean;
	defaultCamera?: "Perspective" | "Orthographic";
	miniCamera?: boolean;
}

export default class Camera {
	app = new ThreeApp({});
	instance?: THREE.PerspectiveCamera | THREE.OrthographicCamera;
	miniCamera?: THREE.PerspectiveCamera;
	controls?: OrbitControls;
	miniCameraControls?: OrbitControls;
	enableControls = false;

	constructor(props: CameraProps) {
		this.enableControls = !!props.enableControls;

		switch (props.defaultCamera) {
			case "Perspective":
				this.setPerspectiveCamera();
				break;

			case "Orthographic":
				this.setOrthographicCamera();
				break;
		}

		if (props.miniCamera) {
			this.setMiniCamera();
		}
	}

	resize() {
		if (this.instance instanceof THREE.Camera) {
			if (this.instance instanceof THREE.PerspectiveCamera) {
				this.instance.aspect = this.app.sizes.width / this.app.sizes.height;
			}

			this.instance.updateProjectionMatrix();
		}
	}

	update() {
		this.controls?.update();
		this.miniCameraControls?.update();
	}

	setPerspectiveCamera() {
		this.clearCamera();
		this.instance = new THREE.PerspectiveCamera(
			75,
			this.app.sizes.width / this.app.sizes.height,
			0.1,
			500
		);
		this.instance.position.z = 8;
		this.setOrbitControl();
		this.app.scene.add(this.instance);
	}

	setOrthographicCamera() {
		this.clearCamera();
		this.instance = new THREE.OrthographicCamera(
			(-this.app.sizes.aspect * this.app.sizes.frustrum) / 2,
			(this.app.sizes.aspect * this.app.sizes.frustrum) / 2,
			this.app.sizes.frustrum / 2,
			-this.app.sizes.frustrum / 2,
			-50,
			50
		);

		this.setOrbitControl();
		this.app.scene.add(this.instance);
	}

	setMiniCamera() {
		this.clearMiniCamera();
		this.miniCamera = new THREE.PerspectiveCamera(
			75,
			this.app.sizes.width / this.app.sizes.height,
			0.1,
			500
		);
		this.miniCamera.position.z = 8;

		this.setOrbitControl();
		this.app.scene.add(this.miniCamera);
	}

	setOrbitControl() {
		if (this.controls) {
			this.controls.dispose();
			this.controls = undefined;
		}

		if (this.enableControls && this.instance instanceof THREE.Camera) {
			if (this.instance instanceof THREE.Camera) {
				this.controls = new OrbitControls(this.instance, this.app.canvas);

				this.controls.enableDamping = true;
			}
			if (this.miniCamera) {
				this.miniCameraControls = new OrbitControls(
					this.miniCamera,
					this.app.canvas
				);
				this.miniCameraControls.enableDamping = true;
			}
		}
	}

	clearCamera() {
		if (this.instance instanceof THREE.Camera) {
			this.instance.clearViewOffset();
			this.instance.clear();
			this.app.scene.remove(this.instance);
			this.instance = undefined;
		}
	}

	clearMiniCamera() {
		if (this.miniCamera instanceof THREE.PerspectiveCamera) {
			this.miniCamera.clearViewOffset();
			this.miniCamera.clear();
			this.app.scene.remove(this.miniCamera);
			this.miniCamera = undefined;
		}
	}
}
