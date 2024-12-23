import { Vector2Like } from "three";
import { inject, singleton } from "tsyringe";

import type {
	Module,
	OffscreenCanvasWithStyle
} from "../../../common/interfaces";
import { RendererService } from "./renderer.service";
import { RendererController } from "./renderer.controller";

@singleton()
export class RendererModule implements Module {
	constructor(
		@inject(RendererController)
		private readonly _controller: RendererController,
		@inject(RendererService) private readonly _service: RendererService
	) {}

	public init(canvas: OffscreenCanvasWithStyle): void {
		this._controller.step$.subscribe(() => this._service.render());
		this._controller.resize$.subscribe((size) =>
			this._service.setSize(size.windowWidth, size.windowHeight)
		);

		this._service.setWebGLRenderer(canvas);
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public instance() {
		return this._service.instance;
	}

	public setSize(value: Vector2Like) {
		return this._service.setSize(value.x, value.y);
	}

	public render() {
		return this._service.render();
	}

	public dispose() {
		this._service.instance?.dispose();
		this._service.instance = undefined;
	}
}
