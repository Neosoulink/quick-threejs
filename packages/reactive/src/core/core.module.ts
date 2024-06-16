import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { Vector2Like } from "three";
import { WorkerThreadModule } from "@quick-threejs/utils/dist/types/worker";

import { CoreController } from "./core.controller";
import { TimerController } from "./timer/timer.controller";
import { TimerModule } from "./timer/timer.module";
import { CameraModule } from "./camera/camera.module";
import { RendererModule } from "./renderer/renderer.module";
import { SizesModule } from "./sizes/sizes.module";
import { Module } from "../common/interfaces/module.interface";
import { OffscreenCanvasWithStyle } from "../common/interfaces/canvas.interface";
import { EventStatus } from "../common/enums/event.enum";

@singleton()
export class CoreModule implements Module, WorkerThreadModule {
	constructor(
		@inject(CoreController) private readonly controller: CoreController,
		@inject(TimerController) private readonly timerController: TimerController,
		@inject(TimerModule) private readonly timerModule: TimerModule,
		@inject(CameraModule) private readonly cameraModule: CameraModule,
		@inject(RendererModule) private readonly rendererModule: RendererModule,
		@inject(SizesModule) private readonly sizesModule: SizesModule
	) {
		self.onmessage = (
			event: MessageEvent<{ canvas?: OffscreenCanvasWithStyle }>
		) => {
			const canvas = event?.data?.canvas;

			if (canvas) this.init(canvas);
		};
	}

	public init(canvas: OffscreenCanvasWithStyle): void {
		canvas["style"] = { width: canvas.width + "", height: canvas.height + "" };

		this.setSize({ x: canvas.width, y: canvas.height });
		this.sizesModule.init(canvas);
		this.timerModule.init();
		this.cameraModule.init();
		this.rendererModule.init(canvas);
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

	public lifecycle$() {
		return this.controller.lifecycle$;
	}

	public step$() {
		return this.timerController.step$;
	}
}

export const coreModule = container.resolve(CoreModule);
