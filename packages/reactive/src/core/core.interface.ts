import { RegisterDto } from "../common/dtos/register.dto";

export interface CoreModuleMessageEventData
	extends Omit<RegisterDto, "canvas" | "location"> {
	canvas?: OffscreenCanvas;
}

export interface CoreModuleMessageEvent
	extends MessageEvent<CoreModuleMessageEventData> {}
