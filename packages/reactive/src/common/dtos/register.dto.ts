/** @description Quick-three register properties. */
export class RegisterDto {
	/**
	 * @description App `canvas` element reference.
	 *
	 * @default undefined
	 */
	canvas?: HTMLCanvasElement;

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
	withMiniCamera?: boolean;

	/** @description */
	fullScreen?: boolean;
}
