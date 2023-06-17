import * as THREE from "three";
import GUI from "lil-gui";

import QuickThreejs from "../../src/index";

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
			{ enableControls: true, axesSizes: 6, enableDebug: true },
			props.domElementRef
		);
		this.gui = this.app.debug?.ui?.addFolder("Experience");
		this.gui?.add({ fn: () => this.construct() }, "fn").name("Enable");
		this.gui?.close();

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

			this.gui = this.app.debug?.ui?.addFolder("Experience");
			this.gui
				?.add({ function: () => this.construct() }, "function")
				.name("Enable");

			if (this.app.updateCallbacks["Experience"]) {
				delete this.app.updateCallbacks["Experience"];
			}

			this.app.destroy();

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
				if (this.app.camera instanceof THREE.PerspectiveCamera) {
					this.app.camera.fov = 35;
				}
				this.app.camera.updateProjectionMatrix();
			}

			// LIGHTS
			const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0.1);
			const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xffffff, 0.8);
			DIRECTIONAL_LIGHT.position.set(0, 0, 1);

			// MESHES
			const TORUS_KNOT = new THREE.Mesh(
				new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
				new THREE.MeshToonMaterial({
					color: 0x1c6d2a,
				})
			);

			// ADD TO SCENE
			this.mainGroup.add(AMBIENT_LIGHT, DIRECTIONAL_LIGHT, TORUS_KNOT);
			this.app.scene.add(this.mainGroup);

			// CAMERA
			if (this.app.camera) {
				this.app.camera.position.z = 20;
			}

			// ANIMATIONS
			this.app.setUpdateCallback("root", () => {
				TORUS_KNOT.rotation.x += 0.01;
				TORUS_KNOT.rotation.y += 0.005;
				TORUS_KNOT.rotation.z += 0.01;
			});

			// GUI
			this.gui = this.app.debug?.ui?.addFolder("Experience");
			this.gui?.addColor(TORUS_KNOT.material, "color").name("Torus knot color");
		}
	}
}

export default Experience;
