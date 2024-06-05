import * as THREE from "three";
import { EventEmitter } from "events";

import Camera from "./Camera";
import Renderer from "./Renderer";
import Sizes, { type SceneSizesType } from "./utils/Sizes";
import Time from "./utils/Time";
import Resources, { type Source } from "./utils/Resources";
import Debug from "./utils/Debug";
import { disposeMaterial } from "./utils/helpers";
import { events } from "./static";

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
	camera?: ConstructorParameters<typeof Camera>[0];
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
	 * @see {@link Source}
	 * @see {@link Resources}
	 *
	 * @defaultValue `undefined`
	 */
	sources?: Source[];
}

export class QuickThreejs extends EventEmitter {
	static instance?: QuickThreejs;
	static tickEvent?: () => unknown;
	static resizeEvent?: () => unknown;

	public scene!: THREE.Scene;
	public camera!: Camera;
	public renderer!: Renderer;
	public sizes!: Sizes;
	public time!: Time;
	public resources!: Resources;
	public debug?: Debug;
	public canvas?: HTMLCanvasElement;

	/**
	 * @param props {@link InitThreeProps}
	 * @param appDom The app Dom element reference
	 */
	constructor(props?: InitThreeProps, appDom = "canvas#app") {
		super();
		if (QuickThreejs.instance) return QuickThreejs.instance;

		QuickThreejs.instance = this;

		// SETUP
		this.scene = new THREE.Scene();
		this.sizes = new Sizes({
			height: props?.sceneSizes?.height,
			width: props?.sceneSizes?.width,
			listenResize: props?.autoSceneResize
		});
		this.time = new Time();
		this.canvas =
			document.querySelector<HTMLCanvasElement>(appDom) ??
			document.createElement("canvas");
		this.camera = new Camera(props?.camera, !!props?.withMiniCamera);
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

		QuickThreejs.tickEvent = () => this.update();
		QuickThreejs.resizeEvent = () => this.resize();

		this.time.on(events.TICKED, QuickThreejs.tickEvent);
		this.sizes.on(events.RESIZED, QuickThreejs.resizeEvent);
		this.emit(events.CONSTRUCTED);
	}

	resize() {
		this.camera.resize();
		this.renderer.resize();
	}

	update() {
		this.debug?.stats?.begin();

		this.emit(events.BEFORE_UPDATE);
		this.camera.update();
		this.debug?.update();

		this.emit(events.PRE_UPDATED);
		this.renderer.update();
		this.emit(events.UPDATED);

		this.debug?.stats?.end();
	}

	destruct() {
		this.time.destruct();
		this.sizes.destruct();
		this.camera.destruct();
		this.renderer.destruct();
		this.debug?.destruct();
		this.resources.destruct();
		this.scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				object.geometry.dispose();

				if (Array.isArray(object.material)) {
					for (let index = 0; index < object.material.length; index++) {
						const material = object.material[index];
						disposeMaterial(material);
					}
				} else {
					disposeMaterial(object.material);
				}
			} else if (object instanceof THREE.Light) object.dispose();
		});
		this.scene.userData = {};

		QuickThreejs.instance = undefined;
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}
}
