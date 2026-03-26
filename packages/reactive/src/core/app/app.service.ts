import { ProxyReceiver } from "@quick-threejs/utils";
import { Lifecycle, scoped } from "tsyringe";

import { AppModulePropsMessageEvent, type OffscreenCanvasStb } from "@/common";

@scoped(Lifecycle.ContainerScoped)
export class AppService {
	private _canvas?: HTMLCanvasElement | OffscreenCanvasStb;

	public readonly proxyReceiver = new ProxyReceiver<Record<string, unknown>>();

	public isInitialized = false;

	init(canvas: AppModulePropsMessageEvent["data"]["canvas"]) {
		if (!canvas) throw new Error("Core App Canvas is not initialized.");

		this.canvas = canvas;
		this.isInitialized = true;
	}

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
