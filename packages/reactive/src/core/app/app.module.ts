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
import { excludeProperties } from "@quick-threejs/utils";

@singleton()
export class AppModule
	extends AppProxyEventHandlersModel
	implements Module, WorkerThreadModule
{
	constructor(
		@inject(AppController) private readonly controller: AppController,
		@inject(AppComponent) private readonly component: AppComponent,
		@inject(TimerModule) private readonly timerModule: TimerModule,
		@inject(SizesModule) private readonly sizesModule: SizesModule,
		@inject(CameraModule) private readonly cameraModule: CameraModule,
		@inject(WorldModule) private readonly worldModule: WorldModule,
		@inject(RendererModule) private readonly rendererModule: RendererModule,
		@inject(DebugModule) private readonly debugModule: DebugModule
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

		this.sizesModule.init(canvas);
		this.timerModule.init(props.startTimer);
		this.cameraModule.init(props.withMiniCamera);
		this.worldModule.init();
		this.rendererModule.init(canvas);
		this.debugModule.init(props);

		this.controller.lifecycle$$.next(AppLifecycleState.INITIALIZED);
	}

	public isInitialized() {
		return this.component.initialized;
	}

	public dispose() {
		this.sizesModule.dispose();
		this.timerModule.dispose();
		this.cameraModule.dispose();
		this.worldModule.dispose();
		this.rendererModule.dispose();
		this.debugModule.dispose();

		this.controller.lifecycle$$.next(AppLifecycleState.DISPOSED);
		this.controller.lifecycle$$.complete();

		self.removeEventListener("message", this._onMessage.bind(this));
	}

	public sizes() {
		return excludeProperties(this.sizesModule, ["init", "dispose"]);
	}

	public timer() {
		return excludeProperties(this.timerModule, ["init", "dispose"]);
	}

	public camera() {
		return excludeProperties(this.cameraModule, ["init", "dispose"]);
	}

	public world() {
		return excludeProperties(this.worldModule, ["init", "dispose"]);
	}

	public renderer() {
		return excludeProperties(this.rendererModule, ["init", "dispose"]);
	}

	public debug() {
		return excludeProperties(this.debugModule, ["init", "dispose"]);
	}

	public lifecycle$() {
		return this.controller.lifecycle$;
	}
}

export const appModule = container.resolve(AppModule);
