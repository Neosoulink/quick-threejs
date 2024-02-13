import {
	OrthographicCamera,
	PerspectiveCamera,
	Camera as ThreeCamera,
} from "three";
import EventEmitter from "events";

import ThreeApp from ".";

import { events } from "./static";

export default class Camera extends EventEmitter {
	private app = new ThreeApp();

	public instance?: PerspectiveCamera | OrthographicCamera;
	public miniCamera?: PerspectiveCamera;
	public updateProjectionMatrix = true;

	constructor(
		defaultCamera?: "perspective" | "orthographic",
		miniCamera?: boolean,
	) {
		super();

		this._setCamera(defaultCamera);
		miniCamera && this._setMiniCamera();
		this.emit(events.CONSTRUCTED);
	}

	private _setCamera(_?: ConstructorParameters<typeof Camera>[0]) {
		this.removeCamera();

		if (_ === "perspective" || _ === undefined) {
			this.instance = new PerspectiveCamera(
				75,
				this.app.sizes.width / this.app.sizes.height,
				0.1,
				100,
			);

			this.instance.position.z = 8;
			this.app.scene.add(this.instance);
		}

		if (_ === "orthographic") {
			this.instance = new OrthographicCamera(
				(-this.app.sizes.aspect * this.app.sizes.frustrum) / 2,
				(this.app.sizes.aspect * this.app.sizes.frustrum) / 2,
				this.app.sizes.frustrum / 2,
				-this.app.sizes.frustrum / 2,
				-50,
				50,
			);
		}

		this.app.debug?.setCameraOrbitControl();
		this.app.debug?.setCameraHelper();

		this.instance && this.app.scene.add(this.instance);
	}

	private _setMiniCamera() {
		this.removeMiniCamera();
		this.miniCamera = new PerspectiveCamera(
			75,
			this.app.sizes.width / this.app.sizes.height,
			0.1,
			500,
		);
		this.miniCamera.position.z = 8;

		this.app.debug?.setMiniCameraOrbitControls();

		this.app.scene.add(this.miniCamera);
	}

	public resize() {
		if (!(this.instance instanceof ThreeCamera)) return;

		if (this.instance instanceof PerspectiveCamera)
			this.instance.aspect = this.app.sizes.width / this.app.sizes.height;

		this.instance.updateProjectionMatrix();
	}

	public update() {
		if (!this.updateProjectionMatrix) return;

		this.instance?.updateProjectionMatrix();
		this.miniCamera?.updateProjectionMatrix();
	}

	public removeCamera() {
		if (!(this.instance instanceof Camera)) return;
		this.instance.clearViewOffset();
		this.instance.clear();
		this.instance.userData = {};
		this.app.scene.remove(this.instance);
		this.instance = undefined;
	}

	public removeMiniCamera() {
		if (!(this.miniCamera instanceof Camera)) return;
		this.miniCamera.clearViewOffset();
		this.miniCamera.clear();
		this.miniCamera.userData = {};
		this.app.scene.remove(this.miniCamera);
		this.miniCamera = undefined;
	}

	destruct() {
		this.removeCamera();
		this.removeMiniCamera();
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}
}
