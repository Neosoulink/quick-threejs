import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { Vector2Like } from "three";
import { WorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";

import { CoreController } from "./core.controller";
import { TimerController } from "./timer/timer.controller";
import { TimerModule } from "./timer/timer.module";
import { CameraModule } from "./camera/camera.module";
import { RendererModule } from "./renderer/renderer.module";
import { SizesModule } from "./sizes/sizes.module";
import { WorldModule } from "./world/world.module";
import { Module } from "../common/interfaces/module.interface";
import { OffscreenCanvasWithStyle } from "../common/interfaces/canvas.interface";
import { EventStatus } from "../common/enums/event.enum";
import { CoreComponent } from "./core.component";

@singleton()
export class CoreModule implements Module, WorkerThreadModule {
	constructor(
		@inject(CoreController) private readonly controller: CoreController,
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(TimerModule) private readonly timerModule: TimerModule,
		@inject(CameraModule) private readonly cameraModule: CameraModule,
		@inject(RendererModule) private readonly rendererModule: RendererModule,
		@inject(SizesModule) private readonly sizesModule: SizesModule,
		@inject(WorldModule) private readonly worldModule: WorldModule,
		@inject(CoreComponent) private readonly component: CoreComponent
	) {
		self.onmessage = (
			event: MessageEvent<{ canvas?: OffscreenCanvasWithStyle }>
		) => {
			const canvas = event?.data?.canvas;

			if (canvas && !this.component.initialized) this.init(canvas);
		};
	}

	public get isInitialized() {
		return this.component.initialized;
	}

	public init(canvas: OffscreenCanvasWithStyle): void {
		canvas["style"] = { width: canvas.width + "", height: canvas.height + "" };

		this.sizesModule.init(canvas);
		this.timerModule.init();
		this.cameraModule.init();
		this.worldModule.init();
		this.rendererModule.init(canvas);

		this.setSize({ x: canvas.width, y: canvas.height });

		this.controller.lifecycle$$.next(EventStatus.ON);
		this.component.initialized = true;
	}

	public setSize(sizes: Vector2Like): void {
		this.controller.resize(sizes);
	}

	public setTimerStatus(status: EventStatus | boolean) {
		if (status) this.timerModule.enable();
		else this.timerModule.disable();
	}

	public dispose(): void {
		this.controller.lifecycle$$.complete();
	}

	// Observables

	public lifecycle$() {
		return this.controller.lifecycle$;
	}

	public step$() {
		return this.timerController.step$;
	}
}

export const coreModule = container.resolve(CoreModule);
