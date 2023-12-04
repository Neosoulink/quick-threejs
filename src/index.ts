import * as THREE from "three";

// UTILS
import Sizes, { type SceneSizesType } from "./utils/Sizes";
import Time from "./utils/Time";
import Camera, { type CameraProps } from "./Camera";
import Renderer from "./Renderer";
import Resources, { type SourceType } from "./utils/Resources";
import Debug from "./utils/Debug";

/**
 * Initialization properties for ThreeJS
 */
export interface InitThreeProps {
	/**
	 * Enable the debug mode
	 *
	 * @defaultValue `false`
	 */
	enableDebug?: boolean;
	/**
	 * Define the {@link THREE.AxesHelper} sizes.
	 *
	 * @remarks
	 * *Deactivated if the value is `0` or `undefined`*
	 * @remarks
	 * *🚧 This property require the {@link InitThreeProps.enableDebug} to be `true`*
	 *
	 * @defaultValue `undefined`
	 */
	axesSizes?: number;
	/**
	 * Define the {@link THREE.GridHelper} sizes.
	 *
	 * @remarks
	 * *Deactivated if the value is `0` or `undefined`*
	 * @remarks
	 * *🚧 This property require the {@link InitThreeProps.enableDebug} to be `true`*
	 *
	 * @defaultValue `undefined`
	 */
	gridSizes?: number;
	/**
	 * Define the `height` and the `width` of the scene.
	 *
	 * @remarks
	 * *Will use the browser inner sizes if the value of each prop if `0` or `undefined`*
	 *
	 * @see {@link SceneSizesType}
	 * @see {@link Sizes}
	 *
	 * @defaultValue `{undefined}`
	 *
	 */
	sceneSizes?: SceneSizesType;
	/**
	 * Enable the scene auto resizing
	 *
	 * @defaultValue `true`
	 */
	autoSceneResize?: boolean;
	/**
	 * The camera to use for the scene.
	 *
	 * @remarks
	 * *Will use `Perspective` camera if the value is `undefined`*
	 *
	 * @see {@link Camera}
	 * @see {@link CameraProps}
	 *
	 * @defaultValue `undefined`
	 */
	camera?: CameraProps["defaultCamera"];
	/**
	 * Display a mini perfective camera at the top right corner of the screen.
	 *
	 * @remarks
	 * *🚧 This property require the {@link InitThreeProps.enableDebug} to be `true`*
	 *
	 * @see {@link Camera}
	 * @see {@link CameraProps}
	 *
	 * @defaultValue `false`
	 */
	withMiniCamera?: boolean;
	/**
	 * A list of resources to load.
	 *
	 * @see {@link SourceType}
	 * @see {@link Resources}
	 *
	 * @defaultValue `undefined`
	 */
	sources?: SourceType[];
}

export default class QuickThreejs {
	static instance?: QuickThreejs;
	static tickEvent?: () => unknown;
	static resizeEvent?: () => unknown;

	public scene!: THREE.Scene;
	public canvas?: HTMLCanvasElement;
	public camera!: Camera;
	public renderer!: Renderer;
	public sizes!: Sizes;
	public time!: Time;
	public resources!: Resources;
	public debug?: Debug;
	public updateCallbacks: { [key: string]: () => unknown } = {};

	/**
	 * @param props {@link InitThreeProps}
	 * @param appDom The app Dom element reference
	 */
	constructor(props?: InitThreeProps, appDom = "canvas#app") {
		if (QuickThreejs.instance) {
			return QuickThreejs.instance;
		}
		QuickThreejs.instance = this;

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

		this.time.on("tick", (QuickThreejs.tickEvent = () => this.update()));
		this.sizes.on("resize", (QuickThreejs.tickEvent = () => this.resize()));
	}

	resize() {
		this.camera.resize();
		this.renderer.resize();
	}

	update() {
		this.debug?.stats?.begin();
		this.camera.update();
		this.debug?.update();

		const UPDATE_CALLBACKS_KEYS = Object.keys(this.updateCallbacks);
		if (UPDATE_CALLBACKS_KEYS?.length) {
			UPDATE_CALLBACKS_KEYS.map((callbackKey) => {
				if (typeof this.updateCallbacks[callbackKey] === "function") {
					this.updateCallbacks[callbackKey]();
				}
			});
		}

		this.renderer.beforeRenderUpdate && this.renderer.beforeRenderUpdate();
		this.renderer.update();
		this.renderer.afterRenderUpdate && this.renderer.afterRenderUpdate();
		this.debug?.stats?.end();
	}

	destroy() {
		if (QuickThreejs.tickEvent) this.time.off("tick", QuickThreejs.tickEvent);
		if (QuickThreejs.resizeEvent)
			this.sizes.off("resize", QuickThreejs.resizeEvent);

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

		delete QuickThreejs.instance;
	}

	setUpdateCallback(key: string, callback: () => unknown) {
		this.updateCallbacks[key] = callback;
	}
}
