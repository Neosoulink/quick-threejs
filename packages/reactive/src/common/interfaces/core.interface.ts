import { RegisterPropsModel } from "../models/register-props.model";

export interface CoreModuleMessageEventData
	extends Omit<RegisterPropsModel, "canvas" | "location"> {
	/**
	 * The canvas element based on.
	 *
	 * @defaultValue `undefined`
	 */
	canvas?: OffscreenCanvas;
}

export interface CoreModuleMessageEvent
	extends MessageEvent<CoreModuleMessageEventData> {}
