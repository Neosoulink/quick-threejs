import { DefaultCameraType } from "../enums/camera.enum";

/** @description Quick-three register properties. */
export class RegisterDto {
	/**
	 * @description App `canvas` element reference.
	 *
	 * @default undefined
	 */
	canvas?: HTMLCanvasElement;

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
	defaultCamera?: DefaultCameraType;

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
	 * @description App location or `URL`.
	 *
	 * @require
	 */
	location!: string;

	/**
	 * @description Start timer on launch.
	 *
	 * @default true
	 */
	startTimer?: boolean;

	/** @description */
	useDefaultCamera?: boolean;

	/** @description */
	fullScreen?: boolean;
}
