import "reflect-metadata";

import type { WorkerThreadModule } from "@quick-threejs/worker";
import { Observable } from "rxjs";
import { inject, scoped, Lifecycle } from "tsyringe";

import {
	type AppModulePropsMessageEvent,
	type Module,
	AppProxyEventHandlersBlueprint,
	OffscreenCanvasStb,
	PROXY_EVENT_LISTENERS
} from "../../common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TimerModule } from "./timer/timer.module";
import { CameraModule } from "./camera/camera.module";
import { RendererModule } from "./renderer/renderer.module";
import { SizesModule } from "./sizes/sizes.module";
import { WorldModule } from "./world/world.module";
import { DebugModule } from "./debug/debug.module";
import { LoaderModule } from "./loader/loader.module";

@scoped(Lifecycle.ContainerScoped)
export class AppModule
	extends AppProxyEventHandlersBlueprint
	implements Module, WorkerThreadModule
{
	constructor(
		@inject(AppController) private readonly _controller: AppController,
		@inject(AppService) private readonly _service: AppService,

		@inject(TimerModule) public readonly timer: TimerModule,
		@inject(SizesModule) public readonly sizes: SizesModule,
		@inject(CameraModule) public readonly camera: CameraModule,
		@inject(WorldModule) public readonly world: WorldModule,
		@inject(RendererModule) public readonly renderer: RendererModule,
		@inject(LoaderModule) public readonly loader: LoaderModule,
		@inject(DebugModule) public readonly debug: DebugModule
	) {
		super();

		this._initProxyEvents();
	}

	private _initProxyEvents() {
		PROXY_EVENT_LISTENERS.forEach((key) => {
			this[`${key}$`] = () => this._controller?.[`${key}$`] as Observable<any>;
			this[key] = (event: any) => this._controller?.[key]?.(event);
		});
	}

	public getProxyReceiver() {
		return this._service.proxyReceiver;
	}

	public getCanvas() {
		return this._service.canvas;
	}

	public getIsInitialized() {
		return this._service.isInitialized;
	}

	public getBeforeStep$() {
		return this.timer.beforeStep$();
	}

	public getStep$() {
		return this.timer.step$();
	}

	public getBeforeRender$() {
		return this.world.getBeforeRender$();
	}

	public getAfterRender$() {
		return this.world.getAfterRender$();
	}

	public init(props: AppModulePropsMessageEvent["data"]) {
		this._service.canvas = props.canvas as OffscreenCanvasStb;

		if (this._service.isInitialized || !this._service.canvas) return;

		this._service.isInitialized = true;

		this.sizes.init(this._service.canvas);
		this.camera.init();
		this.world.init();
		this.renderer.init(this._service.canvas);
		this.timer.init(props.startTimer);
		this.loader.init();
		this.debug.init(props);
	}

	public dispose() {
		this.sizes.dispose();
		this.camera.dispose();
		this.world.dispose();
		this.renderer.dispose();
		this.timer.dispose();
		this.loader.dispose();
		this.debug.dispose();
	}
}
