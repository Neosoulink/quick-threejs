import type { RegisterModule } from "../../modules/register/register.module";
import type { DefaultCameraType } from "../enums/camera.enum";

/** @description Quick-three register properties. */
export class RegisterPropsModel {
	/**
	 * @description The app worker logic location.
	 *
	 * @required
	 */
	location!: string;

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
	 * Enable the debug mode
	 *
	 * @default undefined
	 */
	enableDebug?: boolean;

	/**
	 * Define the {@link THREE.AxesHelper} sizes.
	 *
	 * @remark __Deactivated if the value is `0` or `undefined`__
	 * @remark __This property depends on {@link RegisterPropsModel.enableDebug}__
	 *
	 * @default undefined
	 */
	axesSizes?: number;

	/**
	 * Define the {@link THREE.GridHelper} sizes.
	 *
	 * @remark __Deactivated if the value is `0` or `undefined`__
	 * @remark __This property depends on {@link RegisterPropsModel.enableDebug}__
	 *
	 * @default undefined
	 */
	gridSizes?: number;

	/**
	 * Display a mini perfective camera at the top right corner of the screen.
	 *
	 * @remark __This property depends on {@link RegisterPropsModel.enableDebug}__
	 *
	 * @default false
	 */
	withMiniCamera?: boolean;

	/**
	 * @description Handler called when the app is ready.
	 *
	 * @default undefined
	 */
	onReady?: (register: RegisterModule) => unknown;
}
