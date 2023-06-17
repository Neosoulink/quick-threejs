import * as THREE from "three";

// CLASSES
import ThreeApp from ".";

export default class Renderer {
	private app = new ThreeApp();
	instance: THREE.WebGLRenderer;
	enabled = true;

	constructor() {
		this.instance = new THREE.WebGLRenderer({
			canvas: this.app.canvas,
			antialias: true,
			alpha: true,
		});

		this.instance.useLegacyLights = true;
		this.instance.outputColorSpace = THREE.SRGBColorSpace;
		this.instance.toneMapping = THREE.CineonToneMapping;
		this.instance.toneMappingExposure = 1.75;
		this.instance.shadowMap.enabled = true;
		this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
		this.instance.setClearColor("#211d20");
		this.instance.setSize(this.app.sizes.width, this.app.sizes.height);
		this.instance.setPixelRatio(this.app.sizes.pixelRatio);
	}

	resize() {
		this.instance.setSize(this.app.sizes.width, this.app.sizes.height);
		this.instance.setPixelRatio(this.app.sizes.pixelRatio);
	}

	update() {
		if (this.enabled && this.app.camera instanceof THREE.Camera) {
			this.instance.render(this.app.scene, this.app.camera);
		}
	}
}
