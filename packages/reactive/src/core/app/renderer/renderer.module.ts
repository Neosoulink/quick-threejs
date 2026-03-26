import { inject, Lifecycle, scoped } from "tsyringe";
import { Subscription } from "rxjs";

import type { AppModulePropsMessageEvent, Module } from "@/common";
import { RendererService } from "./renderer.service";
import { RendererController } from "./renderer.controller";

@scoped(Lifecycle.ContainerScoped)
export class RendererModule implements Module {
	private _subscriptions: Subscription[] = [];

	constructor(
		@inject(RendererController)
		private readonly _controller: RendererController,
		@inject(RendererService) private readonly _service: RendererService
	) {}

	public init({ canvas }: AppModulePropsMessageEvent["data"]): void {
		this._subscriptions.push(
			this._controller.step$.subscribe(
				this._service.render.bind(this._service)
			),
			this._controller.resize$.subscribe(
				this._service.handleAutoResize.bind(this._service)
			)
		);

		this._service.init(canvas!);
	}

	public enabled(value?: boolean) {
		if (typeof value === "boolean") this._service.enabled = value;
		return this._service.enabled;
	}

	public enabledAutoResize(value?: boolean) {
		if (typeof value === "boolean") this._service.enabledAutoResize = value;
		return this._service.enabledAutoResize;
	}

	public instance() {
		return this._service.instance;
	}

	public render() {
		return this._service.render();
	}

	public dispose() {
		this._subscriptions.forEach((sub) => sub.unsubscribe());
		this._subscriptions = [];
		this._service.instance?.dispose();
		this._service.instance = undefined;
	}
}
