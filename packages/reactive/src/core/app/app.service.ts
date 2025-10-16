import { ProxyReceiver } from "@quick-threejs/utils";
import { Lifecycle, scoped } from "tsyringe";

import { OffscreenCanvasStb } from "../../common/interfaces";

@scoped(Lifecycle.ContainerScoped)
export class AppService {
	private _canvas?: HTMLCanvasElement | OffscreenCanvasStb;

	public readonly proxyReceiver = new ProxyReceiver<Record<string, unknown>>();

	public isInitialized = false;

	public get canvas(): OffscreenCanvasStb | HTMLCanvasElement | undefined {
		return this._canvas;
	}

	public set canvas(canvas: HTMLCanvasElement | OffscreenCanvasStb) {
		// @ts-ignore
		canvas["style"] = {
			width: canvas.width + "",
			height: canvas.height + ""
		};

		this._canvas = canvas;
	}
}
