import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { expose } from "threads/worker";

import { CoreThreadController } from "./core-thread.controller";
import { EventStatus, KeyEvent } from "../common/interfaces/event.interface";
import { WorkerModule } from "threads/dist/types/worker";

export type ExposedCoreThread = WorkerModule<
	Exclude<keyof CoreThread, number | symbol>
>;

@singleton()
export class CoreThread {
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

	private init(canvas: HTMLCanvasElement): void {
		this.setSize(canvas.width, canvas.height);

		console.log("Core thread OK", canvas);
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

const coreThread = container.resolve(CoreThread);

expose({
	setSize: coreThread.setSize.bind(coreThread),
	setPointerLock: coreThread.setPointerLock.bind(coreThread),
	mouseMove: coreThread.mouseMove.bind(coreThread),
	keyEvent: coreThread.keyEvent.bind(coreThread)
} satisfies ExposedCoreThread);
