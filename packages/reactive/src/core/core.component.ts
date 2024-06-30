import { singleton } from "tsyringe";
import { ProxyReceiver } from "@quick-threejs/utils";

import { OffscreenCanvasWithStyle } from "../common/interfaces/canvas.interface";

@singleton()
export class CoreComponent {
	public readonly proxyReceiver = new ProxyReceiver<Record<string, unknown>>();

	public initialized = false;
	public canvas?: OffscreenCanvasWithStyle;
}
