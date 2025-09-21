/* eslint-disable @typescript-eslint/no-unused-vars */

import type { DefaultCameraType } from "../enums";
import type { ContainerizedApp, Module, LoaderSource } from "../interfaces";
import type { AppModule } from "../../core/app/app.module";
import type { RegisterModule } from "../../core/register/register.module";

/**
 * @description {@link RegisterModule} initialization properties.
 */
export class RegisterPropsBlueprint {
	/**
	 * @description The app worker logic location.
	 *
	 * @required
	 */
	location!: string;

	/**
	 * @description Initialize the app on construct.
	 *
	 * @default true
	 */
	initOnConstruct?: boolean;

	/**
	 * @description App `canvas` element reference.
	 *
	 * @default undefined
	 */
	canvas?: HTMLCanvasElement;

	/**
	 * @description Set the `canvas` view in fullscreen and auto-resize it.
	 *
	 * @default true
	 */
	fullScreen?: boolean;

	/**
	 * Default used camera.
	 *
	 * @see {@link DefaultCameraType}
	 *
	 * @default DefaultCameraType.PERSPECTIVE
	 */
	defaultCamera?: DefaultCameraType;

	/**
	 * @description Start timer update on launch.
	 *
	 * @default true
	 */
	startTimer?: boolean;

	/**
	 * @description Resources to load.
	 *
	 * @default []
	 */
	loaderDataSources?: LoaderSource[] = [];

	/**
	 * @description GLTF Draco decoder path.
	 *
	 * @default undefined
	 */
	loaderDracoDecoderPath?: string;

	/**
	 * @description Will directly load the resources on initialization.
	 *
	 * @remark __This property depends on {@link RegisterPropsBlueprint.initOnConstruct initOnConstruct}__
	 *
	 * @default true
	 */
	loadResourcesOnInit?: boolean;

	/**
	 * @description Enable the debug mode
	 *
	 * @remark __Deactivated if the value is `false` or `undefined`__
	 *
	 * @default undefined
	 */
	enableDebug?: boolean;

	/**
	 * Will enable orbit controls for the cameras.
	 *
	 * @remark __Deactivated if the value is `false` or `undefined`__
	 * @remark __This property depends on {@link RegisterPropsBlueprint.enableDebug enableDebug}__
	 *
	 * @default undefined
	 */
	enableControls?: boolean;

	/**
	 * Define the {@link THREE.AxesHelper} sizes.
	 *
	 * @remark __Deactivated if the value is `0` or `undefined`__
	 * @remark __This property depends on {@link RegisterPropsBlueprint.enableDebug enableDebug}__
	 *
	 * @default undefined
	 */
	axesSizes?: number;

	/**
	 * Define the {@link THREE.GridHelper} sizes.
	 *
	 * @remark __Deactivated if the value is `0` or `undefined`__
	 * @remark __This property depends on {@link RegisterPropsBlueprint.enableDebug enableDebug}__
	 *
	 * @default undefined
	 */
	gridSizes?: number;

	/**
	 * Display a mini perfective camera at the top right corner of the screen.
	 *
	 * @remark __Deactivated if the value is `false` or `undefined`__
	 * @remark __This property depends on {@link RegisterPropsBlueprint.enableDebug enableDebug}__
	 *
	 * @default undefined
	 */
	withMiniCamera?: boolean;

	/**
	 * @description Handler called when the app is ready.
	 *
	 * @default undefined
	 */
	onReady?: (app: ContainerizedApp<RegisterModule>) => unknown;
}

/**
 * @description {@link AppModule} initialization properties.
 */
export class LaunchAppProps<M extends Module> {
	/** @description Handler triggered when the app is ready. */
	onReady?: (workerApp: ContainerizedApp<M>) => unknown;
}
