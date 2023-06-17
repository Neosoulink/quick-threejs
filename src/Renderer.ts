import * as THREE from "three";

// CLASSES
import ThreeApp from ".";

export default class Renderer {
	private app = new ThreeApp();
	intense: THREE.WebGLRenderer;
	enabled = true;

	constructor() {
		this.intense = new THREE.WebGLRenderer({
			canvas: this.app.canvas,
			antialias: true,
			alpha: true,
		});

		this.intense.useLegacyLights = true;
		this.intense.outputColorSpace = THREE.SRGBColorSpace;
		this.intense.toneMapping = THREE.CineonToneMapping;
		this.intense.toneMappingExposure = 1.75;
		this.intense.shadowMap.enabled = true;
		this.intense.shadowMap.type = THREE.PCFSoftShadowMap;
		this.intense.setClearColor("#211d20");
		this.intense.setSize(this.app.sizes.width, this.app.sizes.height);
		this.intense.setPixelRatio(this.app.sizes.pixelRatio);
	}

	resize() {
		this.intense.setSize(this.app.sizes.width, this.app.sizes.height);
		this.intense.setPixelRatio(this.app.sizes.pixelRatio);
	}

	update() {
		if (this.enabled && this.app.camera instanceof THREE.Camera) {
			this.intense.render(this.app.scene, this.app.camera);
		}
	}
}
