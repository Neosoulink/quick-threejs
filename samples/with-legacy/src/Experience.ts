import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { QuickThreejs } from "@quick-threejs/legacy";
import { UPDATED } from "@quick-threejs/legacy/dist/static/event.static";

export interface ExperienceProps {
	/**
	 * String dom element reference of the canvas
	 */
	domElementRef: string;
	/**
	 * Event triggered when the scene is construct
	 */
	onConstruct?: () => unknown;
	/**
	 * Event triggered when the scene is destructed
	 */
	onDestruct?: () => unknown;
}

export class Experience {
	app: QuickThreejs;
	mainGroup?: THREE.Group;
	gui?: GUI;
	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props: ExperienceProps) {
		this.app = new QuickThreejs(
			{
				axesSizes: 5,
				gridSizes: 10,
				enableDebug: true,
				withMiniCamera: true
			},
			props.domElementRef
		);
		this.gui = this.app.debug?.gui?.addFolder("Experience");
		this.gui?.add({ fn: () => this.construct() }, "fn").name("Enable");
		this.gui?.close();

		if (this.app.debug?.cameraControls) {
			this.app.debug.cameraControls.enabled = false;
			this.app.debug.cameraControls.autoRotate = true;
		}

		if (props?.onConstruct) this.onConstruct = props?.onConstruct;
		if (props?.onDestruct) this.onDestruct = props?.onDestruct;
	}

	destroy() {
		if (this.mainGroup) {
			this.mainGroup.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.geometry.dispose();

					for (const key in child.material) {
						const value = child.material[key];

						if (value && typeof value.dispose === "function") {
							value.dispose();
						}
					}
				}
			});

			this.app.scene.remove(this.mainGroup);

			this.mainGroup?.clear();
			this.mainGroup = undefined;

			if (this.gui) {
				this.gui.destroy();
				this.gui = undefined;
			}

			this.gui = this.app.debug?.gui?.addFolder("Experience");
			this.gui
				?.add({ function: () => this.construct() }, "function")
				.name("Enable");

			this.app.destruct();

			this.onDestruct && this.onDestruct();
		}
	}

	async construct() {
		if (this.gui) {
			this.gui.destroy();
			this.gui = undefined;
		}

		if (this.mainGroup) {
			this.destroy();
		}

		if (!this.mainGroup) {
			this.mainGroup = new THREE.Group();

			// APP
			if (this.app.camera) {
				if (this.app.camera.instance instanceof THREE.PerspectiveCamera) {
					this.app.camera.instance.fov = 35;
					this.app.camera.instance.far = 35;
				}
			}

			// LIGHTS
			const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0.1);
			const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xffffff, 0.8);
			DIRECTIONAL_LIGHT.position.set(0, 0, 1);

			// MESHES
			const TORUS_KNOT = new THREE.Mesh(
				new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
				new THREE.MeshToonMaterial({
					color: 0x454545
				})
			);

			// ADD TO SCENE
			this.mainGroup.add(AMBIENT_LIGHT, DIRECTIONAL_LIGHT, TORUS_KNOT);
			this.app.scene.add(this.mainGroup);

			// ANIMATIONS
			this.app?.on(UPDATED, () => {
				TORUS_KNOT.rotation.x += 0.01;
				TORUS_KNOT.rotation.y += 0.005;
				TORUS_KNOT.rotation.z += 0.01;
			});

			// GUI
			this.gui = this.app.debug?.gui?.addFolder("Experience");
			this.gui?.addColor(TORUS_KNOT.material, "color").name("Torus knot color");
		}
	}
}

export default Experience;
