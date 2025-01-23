import { ProxyReceiver } from "@quick-threejs/utils";
import { Lifecycle, scoped } from "tsyringe";

import { OffscreenCanvasWithStyle } from "../../common/interfaces";

@scoped(Lifecycle.ContainerScoped)
export class AppService {
	private _canvas?: OffscreenCanvasWithStyle;

	public readonly proxyReceiver = new ProxyReceiver<Record<string, unknown>>();

	public isInitialized = false;

	public get canvas(): OffscreenCanvasWithStyle | undefined {
		return this._canvas;
	}

	public set canvas(canvas: OffscreenCanvasWithStyle | OffscreenCanvas) {
		canvas["style"] = {
			width: canvas.width + "",
			height: canvas.height + ""
		};

		this._canvas = canvas as OffscreenCanvasWithStyle;
	}
}
