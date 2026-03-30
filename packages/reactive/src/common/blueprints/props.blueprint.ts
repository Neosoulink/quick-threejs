/* eslint-disable @typescript-eslint/no-unused-vars */

import type { DefaultCameraType } from "../enums";
import type {
	ContainerizedApp,
	Module,
	LoaderSource,
	OffscreenCanvasStb
} from "../interfaces";
import type { AppModule } from "@/core/app/app.module";
import type { RegisterModule } from "@/core/register/register.module";

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
	 * @description Initialize the app on main thread.
	 *
	 * @default false
	 */
	mainThread?: boolean;

	/**
	 * @description App `canvas` element reference.
	 *
	 * @note If not provided, the canvas will be created automatically.
	 *
	 * @default undefined
	 */
	canvas?: HTMLCanvasElement;

	/**
	 * @description Wrapper element for the canvas used to set the canvas size.
	 *
	 * @note If the `fullScreen` property is `true`, the element won't be used to set the canvas size.
	 *
	 * @default undefined
	 */
	canvasWrapper?: HTMLElement | "parent";

	/**
	 * @description Use the window size to render the canvas in fullscreen and auto-resize it.
	 *
	 * @default true
	 */
	fullScreen?: boolean;

	/**
	 * Initial pixel ratio to use for the renderer.
	 *
	 * @default `Math.min(window.devicePixelRatio, 2)`
	 */
	pixelRatio?: number;

	/**
	 * @description Auto-resize the renderer when the canvas size changes.
	 *
	 * @note Will have no effect if either {@link LaunchAppProps.fullScreen} or {@link RegisterPropsBlueprint.canvasWrapper} are not provided.
	 *
	 * @default true
	 */
	autoRenderResize?: boolean;

	/**
	 * Default used camera.
	 *
	 * @see {@link DefaultCameraType}
	 *
	 * @default DefaultCameraType.PERSPECTIVE
	 */
	defaultCamera?: DefaultCameraType;

	/**
	 * @description Stepping the timer animation loop on launch.
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
	 * @description Debug properties.
	 *
	 * @default undefined
	 */
	debug?: {
		/**
		 * @description Enable the debug mode
		 *
		 * @remark __Deactivated if the value is `false` or `undefined`__
		 *
		 * @default undefined
		 */
		enabled?: boolean;

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
	};

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
	/**
	 * @description App `canvas` element reference.
	 *
	 * @note Will be used on main-thread strategy only.
	 */
	canvas?: OffscreenCanvasStb | HTMLCanvasElement;

	/** @description Handler triggered when the app is ready. */
	onReady?: (workerApp: ContainerizedApp<M>) => unknown;
}
