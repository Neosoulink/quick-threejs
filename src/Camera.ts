import * as THREE from "three";

// CLASSES
import ThreeApp from ".";

export interface CameraProps {
	defaultCamera?: "Perspective" | "Orthographic";
	miniCamera?: boolean;
}

export default class Camera {
	private app = new ThreeApp({});
	instance?: THREE.PerspectiveCamera | THREE.OrthographicCamera;
	miniCamera?: THREE.PerspectiveCamera;
	updateProjectionMatrix = true;

	constructor(props: CameraProps) {
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

	setPerspectiveCamera() {
		this.clearCamera();
		this.instance = new THREE.PerspectiveCamera(
			75,
			this.app.sizes.width / this.app.sizes.height,
			0.1,
			100
		);
		this.instance.position.z = 8;

		this.app.debug?.setCameraOrbitControl();
		this.app.debug?.setCameraHelper();

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

		this.app.debug?.setCameraOrbitControl();
		this.app.debug?.setCameraHelper();

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

		this.app.debug?.setMiniCameraOrbitControls();

		this.app.scene.add(this.miniCamera);
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
		if (this.updateProjectionMatrix) {
			this.instance?.updateProjectionMatrix();
			this.miniCamera?.updateProjectionMatrix();
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
