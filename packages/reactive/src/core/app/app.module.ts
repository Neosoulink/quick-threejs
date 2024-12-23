import "reflect-metadata";

import { type WorkerThreadModule } from "@quick-threejs/utils";
import { Observable } from "rxjs";
import { inject, scoped, Lifecycle } from "tsyringe";

import {
	type CoreModuleMessageEventData,
	type Module,
	AppProxyEventHandlersModel,
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

@scoped(Lifecycle.ContainerScoped)
export class AppModule
	extends AppProxyEventHandlersModel
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

	public init(props: CoreModuleMessageEventData) {
		if (
			this._service.initialized ||
			!props?.canvas ||
			!(this._service.canvas = props.canvas)
		)
			return;

		this._service.initialized = true;

		this.sizes.init(this._service.canvas);
		this.camera.init(props.withMiniCamera);
		this.world.init();
		this.renderer.init(this._service.canvas);
		this.timer.init(props.startTimer);
		this.debug.init(props);
	}

	public isInitialized() {
		return this._service.initialized;
	}

	public beforeStep$() {
		return this.timer.beforeStep$();
	}

	public step$() {
		return this.timer.step$();
	}

	public dispose() {
		this.sizes.dispose();
		this.camera.dispose();
		this.world.dispose();
		this.renderer.dispose();
		this.timer.dispose();
		this.debug.dispose();
	}
}
