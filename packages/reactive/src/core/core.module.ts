import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { expose } from "threads/worker";
import { WorkerModule } from "threads/dist/types/worker";

import { CoreController } from "./core.controller";
import { TimerModule } from "./timer/timer.module";
import { CameraModule } from "./camera/camera.module";
import { RendererModule } from "./renderer/renderer.module";
import { EventStatus, KeyEvent } from "../common/interfaces/event.interface";
import { Module } from "../common/interfaces/module.interface";
import { OffscreenCanvasWithStyle } from "../common/interfaces/canvas.interface";
import { SizesModule } from "./sizes/sizes.module";
import { WorkerThreadModule } from "@quick-threejs/utils";
import { Observable, Subject } from "threads/observable";

export type ExposedCoreModule = WorkerModule<
	Exclude<keyof CoreModule, number | symbol>
>;

@singleton()
export class CoreModule implements Module, WorkerThreadModule {
	private readonly _lifecycleSubject = new Subject();

	constructor(
		@inject(CoreController) private readonly controller: CoreController,
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
		// @ts-ignore
		canvas["style"] = { width: canvas.width + "", height: canvas.height + "" };

		this.setSize(canvas.width, canvas.height);
		this.sizesModule.init(canvas);
		this.timerModule.init();
		this.cameraModule.init();
		this.rendererModule.init(canvas);
	}

	public setSize(width: number, height: number): void {
		this.controller.resize(width, height);
	}

	public setPointerLock(status: EventStatus): void {
		this.controller.setPointerLock(status);
	}

	public mouseMove(x: number, y: number): void {
		this.controller.move(x, y);
	}

	public keyEvent(keyEvent: KeyEvent): void {
		this.controller.keyEvent(keyEvent);
	}

	public lifecycle() {
		return Observable.from(this._lifecycleSubject);
	}
}

const coreModule = container.resolve(CoreModule);

expose({
	setSize: coreModule.setSize.bind(coreModule),
	setPointerLock: coreModule.setPointerLock.bind(coreModule),
	mouseMove: coreModule.mouseMove.bind(coreModule),
	keyEvent: coreModule.keyEvent.bind(coreModule),
	lifecycle: coreModule.lifecycle.bind(coreModule),
	init: () => {}
} satisfies ExposedCoreModule);
