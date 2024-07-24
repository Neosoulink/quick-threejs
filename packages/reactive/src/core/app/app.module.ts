import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import type { WorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";

import { AppController } from "./app.controller";
import { AppComponent } from "./app.component";
import { TimerModule } from "./timer/timer.module";
import { CameraModule } from "./camera/camera.module";
import { RendererModule } from "./renderer/renderer.module";
import { SizesModule } from "./sizes/sizes.module";
import { WorldModule } from "./world/world.module";
import { DebugModule } from "./debug/debug.module";
import { AppLifecycleState } from "../../common/enums/lifecycle.enum";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";
import { AppProxyEventHandlersModel } from "../../common/models/app-proxy-event-handler.model";
import type { Module } from "../../common/interfaces/module.interface";
import type { OffscreenCanvasWithStyle } from "../../common/interfaces/canvas.interface";
import type {
	CoreModuleMessageEvent,
	CoreModuleMessageEventData
} from "../../common/interfaces/core.interface";

@singleton()
export class AppModule
	extends AppProxyEventHandlersModel
	implements Module, WorkerThreadModule
{
	constructor(
		@inject(AppController) private readonly controller: AppController,
		@inject(AppComponent) private readonly component: AppComponent,

		@inject(TimerModule) public readonly timer: TimerModule,
		@inject(SizesModule) public readonly sizes: SizesModule,
		@inject(CameraModule) public readonly camera: CameraModule,
		@inject(WorldModule) public readonly world: WorldModule,
		@inject(RendererModule) public readonly renderer: RendererModule,
		@inject(DebugModule) public readonly debug: DebugModule
	) {
		super();
		this._initProxyEvents();

		self.addEventListener("message", this._onMessage.bind(this));
	}

	private _initProxyEvents() {
		PROXY_EVENT_LISTENERS.forEach((key) => {
			this[key] = (event: Event) => {
				this.controller?.[key]?.(event);
			};

			this[`${key}$`] = () => this.controller?.[`${key}$`];
		});
	}

	private _onMessage(event: CoreModuleMessageEvent) {
		if (!event.data?.canvas || this.component.initialized) return;

		const startTimer = !!event.data?.startTimer;
		const withMiniCamera = !!event.data?.withMiniCamera;
		const fullScreen = !!event.data?.fullScreen;

		this.init({
			...event.data,
			startTimer,
			withMiniCamera,
			fullScreen
		});
	}

	public init(props: CoreModuleMessageEventData) {
		if (!props.canvas || this.component.initialized) return;
		this.component.initialized = true;

		props.canvas["style"] = {
			width: props.canvas.width + "",
			height: props.canvas.height + ""
		};
		const canvas = props.canvas as OffscreenCanvasWithStyle;

		this.component.canvas = canvas;

		this.sizes.init(canvas);
		this.timer.init(props.startTimer);
		this.camera.init(props.withMiniCamera);
		this.world.init();
		this.renderer.init(canvas);
		this.debug.init(props);

		this.controller.lifecycle$$.next(AppLifecycleState.INITIALIZED);
	}

	public get canvas() {
		return this.component.canvas;
	}

	public get initialized() {
		return this.component.initialized;
	}

	public isInitialized() {
		return this.component.initialized;
	}

	public dispose() {
		this.sizes.dispose();
		this.timer.dispose();
		this.camera.dispose();
		this.world.dispose();
		this.renderer.dispose();
		this.debug.dispose();

		this.controller.lifecycle$$.next(AppLifecycleState.DISPOSED);
		this.controller.lifecycle$$.complete();

		self.removeEventListener("message", this._onMessage.bind(this));
	}

	public lifecycle$() {
		return this.controller.lifecycle$;
	}
}

export const appModule = container.resolve(AppModule);
