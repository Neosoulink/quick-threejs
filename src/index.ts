import * as THREE from "three";

// CONSTANTS
import SOURCES from "./sources";

// HELPERS
import Sizes, { SceneSizesType } from "./utils/Sizes";
import Time from "./utils/Time";
import Camera, { CameraProps } from "./Camera";
import Renderer from "./Renderer";
import Resources from "./utils/Resoureces";
import Debug from "./utils/Debug";

let instance: ThreeApp;
let tickEvent: () => unknown | undefined;
let resizeEvent: () => unknown | undefined;

export interface InitThreeProps {
	enableControls?: boolean;
	enableCameraHelper?: boolean;
	enableDebug?: boolean;
	axesSizes?: number;
	gridSizes?: number;
	sceneSizes?: SceneSizesType;
	autoSceneResize?: boolean;
	camera?: CameraProps["defaultCamera"];
	withMiniCamera?: boolean;
}

export default class ThreeApp {
	private viewPortSizes: SceneSizesType = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
	sceneSizes!: SceneSizesType;
	scene!: THREE.Scene;
	canvas?: HTMLCanvasElement;
	_camera!: Camera;
	rendererInstance!: Renderer;
	sizes!: Sizes;
	time!: Time;
	resources!: Resources;
	debug?: Debug;
	updateCallbacks: { [key: string]: () => unknown } = {};

	constructor(props?: InitThreeProps, appDom = "canvas#app") {
		if (instance) {
			return instance;
		}

		instance = this;

		const DOM_APP = document.querySelector<HTMLCanvasElement>(appDom)!;
		const SCENE_SIZES = props?.sceneSizes ?? this.viewPortSizes;
		const SIZES_INSTANCE = new Sizes({
			height: SCENE_SIZES.height,
			width: SCENE_SIZES.width,
			listenResize: props?.autoSceneResize,
		});
		const timeInstance = new Time();

		// SETUP
		this.debug = new Debug(props?.enableDebug);
		this.scene = new THREE.Scene();
		this.sizes = SIZES_INSTANCE;
		this.time = timeInstance;
		this.sceneSizes = {
			height: SIZES_INSTANCE.height,
			width: SIZES_INSTANCE.width,
		};
		this.canvas = DOM_APP;
		this._camera = new Camera({
			enableControls: !!props?.enableControls,
			defaultCamera: props?.camera || "Perspective",
			miniCamera: !!props?.withMiniCamera,
		});
		this.rendererInstance = new Renderer({
			enableMiniRender: !!props?.withMiniCamera,
		});
		this.resources = new Resources(SOURCES);

		if (props?.enableCameraHelper && this.camera) {
			const CAMERA_HELPER = new THREE.CameraHelper(this.camera);
			this.scene.add(CAMERA_HELPER);
		}

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

		tickEvent = () => {
			this.update();
		};
		resizeEvent = () => {
			this.resize();
		};

		this.time.on("tick", tickEvent);
		this.sizes.on("resize", resizeEvent);
	}

	resize() {
		this._camera.resize();

		this.rendererInstance.resize();
	}

	update() {
		this._camera.update();
		this.rendererInstance.update();

		if (this.debug?.stats) this.debug.stats.begin();

		const UPDATE_CALLBACKS_KEYS = Object.keys(this.updateCallbacks);
		if (UPDATE_CALLBACKS_KEYS?.length) {
			UPDATE_CALLBACKS_KEYS.map((callbackKey) => {
				if (typeof this.updateCallbacks[callbackKey] === "function") {
					this.updateCallbacks[callbackKey]();
				}
			});
		}

		if (this.debug?.stats) this.debug.stats.end();
	}

	destroy() {
		if (tickEvent) this.time.off("tick", tickEvent);
		if (resizeEvent) this.sizes.off("resize", resizeEvent);

		// Traverse the whole scene
		this.scene.traverse((child) => {
			// Test if it's a mesh
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();

				// Loop through the material properties
				for (const key in child.material) {
					if (child.material.hasOwnProperty(key)) {
						const value = child.material[key];

						// Test if there is a dispose function
						if (value && typeof value.dispose === "function") {
							value.dispose();
						}
					}
				}
			}
		});

		this._camera.controls?.dispose();
		this._camera.miniCameraControls?.dispose();
		this.renderer.dispose();

		if (this.debug?.active) this.debug.ui?.destroy();
	}

	setUpdateCallback(key: string, callback: () => unknown) {
		this.updateCallbacks[key] = callback;
	}

	get camera() {
		return this._camera.instance;
	}

	get renderer() {
		return this.rendererInstance.instance;
	}
}
