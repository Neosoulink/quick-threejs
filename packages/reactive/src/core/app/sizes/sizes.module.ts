import { Subscription } from "rxjs";
import { inject, Lifecycle, scoped } from "tsyringe";

import type { AppModulePropsMessageEvent, Module } from "@/common";
import { SizesService } from "./sizes.service";
import { SizesController } from "./sizes.controller";

@scoped(Lifecycle.ContainerScoped)
export class SizesModule implements Module {
	private _subscriptions: Subscription[] = [];

	constructor(
		@inject(SizesController) private readonly _controller: SizesController,
		@inject(SizesService) private readonly _service: SizesService
	) {}

	public init({
		canvas,
		pixelRatio,
		fullScreen,
		hasCanvasWrapper
	}: AppModulePropsMessageEvent["data"]) {
		this._subscriptions.push(
			this._controller.resize$.subscribe(
				this._service.handleResize.bind(this._service)
			)
		);

		this._service.init(canvas!, pixelRatio, fullScreen, hasCanvasWrapper);
	}

	public dispose() {
		this._subscriptions.forEach((sub) => sub.unsubscribe());
		this._subscriptions = [];
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public frustrum(value?: number) {
		if (typeof value === "number") this._service.frustrum = value;
		return this._service.frustrum;
	}

	public height(value?: number) {
		if (typeof value === "number") this._service.height = value;
		return this._service.height;
	}

	public width(value?: number) {
		if (typeof value === "number") this._service.width = value;
		return this._service.width;
	}

	public wrapperHeight(value?: number) {
		if (typeof value === "number") this._service.wrapperHeight = value;
		return this._service.wrapperHeight;
	}

	public wrapperWidth(value?: number) {
		if (typeof value === "number") this._service.wrapperWidth = value;
		return this._service.wrapperWidth;
	}

	public windowHeight(value?: number) {
		if (typeof value === "number") this._service.windowHeight = value;
		return this._service.windowHeight;
	}

	public windowWidth(value?: number) {
		if (typeof value === "number") this._service.windowWidth = value;
		return this._service.windowWidth;
	}

	public aspect(value?: number) {
		if (typeof value === "number") this._service.aspect = value;
		return this._service.aspect;
	}

	public pixelRatio(value?: number) {
		if (typeof value === "number") this._service.pixelRatio = value;
		return this._service.pixelRatio;
	}

	public getViewPortSizes() {
		return this._service.getViewPortSizes();
	}

	public resize$() {
		return this._controller.resize$;
	}
}
