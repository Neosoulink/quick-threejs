import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { Vector2Like } from "three";
import { WorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";

import { CoreController } from "./core.controller";
import { CoreComponent } from "./core.component";
import { TimerModule } from "./timer/timer.module";
import { CameraModule } from "./camera/camera.module";
import { RendererModule } from "./renderer/renderer.module";
import { SizesModule } from "./sizes/sizes.module";
import { WorldModule } from "./world/world.module";
import type {
	CoreModuleMessageEvent,
	CoreModuleMessageEventData
} from "./core.interface";
import type { Module } from "../common/interfaces/module.interface";
import type { OffscreenCanvasWithStyle } from "../common/interfaces/canvas.interface";

@singleton()
export class CoreModule implements Module, WorkerThreadModule {
	constructor(
		@inject(CoreController) private readonly controller: CoreController,
		@inject(CoreComponent) private readonly component: CoreComponent,
		@inject(TimerModule) public readonly timer: TimerModule,
		@inject(SizesModule) public readonly sizes: SizesModule,
		@inject(CameraModule) public readonly camera: CameraModule,
		@inject(WorldModule) public readonly world: WorldModule,
		@inject(RendererModule) public readonly renderer: RendererModule
	) {
		self.onmessage = (event: CoreModuleMessageEvent) => {
			const canvas = event?.data?.canvas;
			const startTimer = !!event?.data?.startTimer;
			const useDefaultCamera = !!event?.data?.useDefaultCamera;
			const withMiniCamera = !!event?.data?.withMiniCamera;
			const fullScreen = !!event?.data?.fullScreen;

			if (canvas && !this.component.initialized)
				this.init({
					canvas,
					startTimer,
					useDefaultCamera,
					withMiniCamera,
					fullScreen
				});
		};
	}

	public isInitialized() {
		return this.component.initialized;
	}

	public init(props: CoreModuleMessageEventData): void {
		if (!props.canvas) return;

		props.canvas["style"] = {
			width: props.canvas.width + "",
			height: props.canvas.height + ""
		};

		this.sizes.init(props.canvas as OffscreenCanvasWithStyle);
		this.timer.init(props.startTimer);
		this.camera.init(props.useDefaultCamera, props.withMiniCamera);
		this.world.init();
		this.renderer.init(props.canvas as OffscreenCanvasWithStyle);

		this.setSize({ x: props.canvas.width, y: props.canvas.height });

		this.controller.lifecycle$$.next(true);
		this.component.initialized = true;
	}

	public setSize(sizes: Vector2Like): void {
		this.controller.resize(sizes);
	}

	public dispose(): void {
		this.timer.dispose();
		this.camera.dispose();
		this.renderer.dispose();
		this.sizes.dispose();
		this.world.dispose();
		this.controller.lifecycle$$.complete();
	}

	public lifecycle$() {
		return this.controller.lifecycle$;
	}
}

export const coreModule = container.resolve(CoreModule);
