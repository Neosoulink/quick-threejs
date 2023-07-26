import * as THREE from "three";

// HELPERS
import Sizes, { SceneSizesType } from "./utils/Sizes";
import Time from "./utils/Time";
import Camera, { CameraProps } from "./Camera";
import Renderer from "./Renderer";
import Resources, { SourceType } from "./utils/Resources";
import Debug from "./utils/Debug";

export interface InitThreeProps {
	enableDebug?: boolean;
	axesSizes?: number;
	gridSizes?: number;
	sceneSizes?: SceneSizesType;
	autoSceneResize?: boolean;
	camera?: CameraProps["defaultCamera"];
	withMiniCamera?: boolean;
	sources?: SourceType[];
}

export default class ThreeApp {
	static instance?: ThreeApp;
	static tickEvent?: () => unknown;
	static resizeEvent?: () => unknown;
	scene!: THREE.Scene;
	canvas?: HTMLCanvasElement;
	camera!: Camera;
	renderer!: Renderer;
	sizes!: Sizes;
	time!: Time;
	resources!: Resources;
	debug?: Debug;
	updateCallbacks: { [key: string]: () => unknown } = {};

	constructor(props?: InitThreeProps, appDom = "canvas#app") {
		if (ThreeApp.instance) {
			return ThreeApp.instance;
		}
		ThreeApp.instance = this;

		// SETUP
		this.scene = new THREE.Scene();
		this.sizes = new Sizes({
			height: props?.sceneSizes?.height,
			width: props?.sceneSizes?.width,
			listenResize: props?.autoSceneResize,
		});
		this.time = new Time();
		this.canvas = document.querySelector<HTMLCanvasElement>(appDom)!;
		this.camera = new Camera({
			defaultCamera: props?.camera || "Perspective",
			miniCamera: !!props?.withMiniCamera,
		});
		this.resources = new Resources(props?.sources);
		this.debug = new Debug(props?.enableDebug);
		this.renderer = new Renderer();

		if (typeof props?.axesSizes === "number") {
			const AXES_HELPER = new THREE.AxesHelper(props?.axesSizes);
			this.scene.add(AXES_HELPER);
		}

		if (typeof props?.gridSizes === "number") {
			const GRID_HELPER = new THREE.GridHelper(
				props?.gridSizes,
				props?.gridSizes
			);
			this.scene.add(GRID_HELPER);
		}

		this.time.on("tick", (ThreeApp.tickEvent = () => this.update()));
		this.sizes.on("resize", (ThreeApp.tickEvent = () => this.resize()));
	}

	resize() {
		this.camera.resize();
		this.renderer.resize();
	}

	update() {
		this.debug?.stats?.begin();

		this.camera.update();
		this.debug?.update();
		this.renderer.update();

		const UPDATE_CALLBACKS_KEYS = Object.keys(this.updateCallbacks);
		if (UPDATE_CALLBACKS_KEYS?.length) {
			UPDATE_CALLBACKS_KEYS.map((callbackKey) => {
				if (typeof this.updateCallbacks[callbackKey] === "function") {
					this.updateCallbacks[callbackKey]();
				}
			});
		}

		this.debug?.stats?.end();
	}

	destroy() {
		if (ThreeApp.tickEvent) this.time.off("tick", ThreeApp.tickEvent);
		if (ThreeApp.resizeEvent) this.sizes.off("resize", ThreeApp.resizeEvent);

		this.scene.traverse((child) => {
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

		this.renderer.instance.dispose();
		this.debug?.destroy();

		delete ThreeApp.instance;
	}

	setUpdateCallback(key: string, callback: () => unknown) {
		this.updateCallbacks[key] = callback;
	}
}
