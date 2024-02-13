import * as THREE from "three";
import EventEmitter from "events";

import ThreeApp from ".";

export interface RendererProps {
	enableMiniRender?: boolean;
}

export default class Renderer extends EventEmitter {
	protected _app = new ThreeApp();

	public instance: THREE.WebGLRenderer;
	public enabled = true;

	constructor() {
		super();

		this.instance = new THREE.WebGLRenderer({
			canvas: this._app.canvas,
			antialias: true,
			alpha: true,
		});
		this.instance.outputColorSpace = THREE.SRGBColorSpace;
		this.instance.toneMapping = THREE.CineonToneMapping;
		this.instance.toneMappingExposure = 1.75;
		this.instance.shadowMap.enabled = true;
		this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
		this.instance.setClearColor("#211d20");
		this.instance.setSize(this._app.sizes.width, this._app.sizes.height);
		this.instance.setPixelRatio(this._app.sizes.pixelRatio);
	}

	resize() {
		this.instance.setSize(this._app.sizes.width, this._app.sizes.height);
		this.instance.setPixelRatio(this._app.sizes.pixelRatio);
	}

	destruct() {
		this.instance.dispose();
		this.removeAllListeners();
	}

	update() {
		if (!(this.enabled && this._app.camera.instance instanceof THREE.Camera))
			return;

		this.instance.setViewport(
			0,
			0,
			this._app.sizes.width,
			this._app.sizes.height,
		);
		this.instance.render(this._app.scene, this._app.camera.instance);

		if (this._app.debug?.active && this._app.camera.miniCamera) {
			this.instance.setScissorTest(true);
			this.instance.setViewport(
				this._app.sizes.width - this._app.sizes.width / 3,
				this._app.sizes.height - this._app.sizes.height / 3,
				this._app.sizes.width / 3,
				this._app.sizes.height / 3,
			);
			this.instance.setScissor(
				this._app.sizes.width - this._app.sizes.width / 3,
				this._app.sizes.height - this._app.sizes.height / 3,
				this._app.sizes.width / 3,
				this._app.sizes.height / 3,
			);
			this.instance.render(this._app.scene, this._app.camera.miniCamera);
			this.instance.setScissorTest(false);
		}
	}
}
