import { singleton } from "tsyringe";
import { Vector2Like } from "three";
import { ProxyReceiver } from "@quick-threejs/utils";

import { OffscreenCanvasWithStyle } from "../common/interfaces/canvas.interface";

@singleton()
export class CoreComponent {
	public readonly proxyReceiver = new ProxyReceiver<
		Record<string, Vector2Like>
	>();

	public initialized = false;
	public canvas?: OffscreenCanvasWithStyle;
}
