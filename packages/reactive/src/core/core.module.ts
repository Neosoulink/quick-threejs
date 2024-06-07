import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { expose } from "threads/worker";
import { WorkerModule } from "threads/dist/types/worker";

import { CoreThreadController } from "./core.controller";
import { EventStatus, KeyEvent } from "../common/interfaces/event.interface";
import { Module } from "../common/interfaces/module.interface";

export type ExposedCoreModule = WorkerModule<
	Exclude<keyof CoreModule, number | symbol>
>;

@singleton()
export class CoreModule implements Module {
	constructor(
		@inject(CoreThreadController)
		private readonly controller: CoreThreadController
	) {
		this.initCanvas();
	}

	private initCanvas(): void {
		onmessage = (event) => {
			const canvas: HTMLCanvasElement | undefined = event?.data?.canvas;
			if (canvas) this.init(canvas);
		};
	}

	public init(canvas: HTMLCanvasElement): void {
		this.setSize(canvas.width, canvas.height);
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
}

const coreThread = container.resolve(CoreModule);

expose({
	setSize: coreThread.setSize.bind(coreThread),
	setPointerLock: coreThread.setPointerLock.bind(coreThread),
	mouseMove: coreThread.mouseMove.bind(coreThread),
	keyEvent: coreThread.keyEvent.bind(coreThread),
	init: () => {}
} satisfies ExposedCoreModule);
