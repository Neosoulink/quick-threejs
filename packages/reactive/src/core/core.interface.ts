import { RegisterDto } from "../common/dtos/register.dto";

export interface CoreModuleMessageEventData
	extends Omit<RegisterDto, "canvas" | "location"> {
	/**
	 * The canvas element based on.
	 *
	 * @defaultValue `undefined`
	 */
	canvas?: OffscreenCanvas;
}

export interface CoreModuleMessageEvent
	extends MessageEvent<CoreModuleMessageEventData> {}
