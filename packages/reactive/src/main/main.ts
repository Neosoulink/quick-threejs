import "reflect-metadata";

import { WorkerImplementation } from "threads/dist/types/master";
import { spawn, Worker } from "threads";
import { container, inject, singleton } from "tsyringe";
import { WorkerModule } from "threads/dist/types/worker";

import { MainDto } from "./dto/main.dto";
import { MainController } from "./main.controller";
import type { ExposedCoreThread } from "../core/core-thread";

@singleton()
class Main {
	private canvas!: HTMLCanvasElement;
	private coreThread?: ExposedCoreThread;
	private coreWorker?: WorkerImplementation;

	constructor(
		@inject(MainController) private readonly controller: MainController,
		@inject(MainDto.name) private readonly props: MainDto
	) {
		this.initCanvas();
		this.initCoreThread();
	}

	private initCanvas() {
		try {
			this.canvas = document.createElement("canvas");

			if (this.props.canvas instanceof HTMLCanvasElement)
				this.canvas = this.props.canvas;

			if (typeof this.props.canvas === "string") {
				const canvas_ = document.querySelector(this.props.canvas as string);

				if (canvas_ instanceof HTMLCanvasElement) this.canvas = canvas_;
			}

			if (!this.canvas.parentElement) document.body.appendChild(this.canvas);
		} catch (err: any) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err?.message ?? "Something went wrong"}`
			);
		}
	}

	private async initThread<T extends object>(worker: WorkerImplementation) {
		const thread =
			await spawn<WorkerModule<Exclude<keyof T, number | symbol>>>(worker);
		console.log(thread);

		return [thread, worker] as const;
	}

	private initCoreThread() {
		const offscreenCanvas = this.canvas.transferControlToOffscreen();
		offscreenCanvas.width = this.canvas.clientWidth;
		offscreenCanvas.height = this.canvas.clientHeight;

		this.initThread<ExposedCoreThread>(
			new Worker(
				new URL("../core/core-thread.ts", import.meta.url) as unknown as string,
				{
					type: "module"
				}
			)
		).then(([coreThread, coreWorker]) => {
			this.coreThread = coreThread;
			this.coreWorker = coreWorker;

			this.coreWorker.postMessage({ canvas: offscreenCanvas }, [
				offscreenCanvas
			]);

			this.initController();

			console.log("Core thread created");
		});
	}

	private initController(): void {
		this.controller.init(this.canvas);

		this.controller.mouseMove$.subscribe((event) =>
			this.coreThread?.mouseMove(event.x, event.y)
		);

		this.controller.resize$.subscribe(() =>
			this.coreThread?.setSize(window.innerWidth, window.innerHeight)
		);

		this.controller.pointerLock$.subscribe((status) =>
			this.coreThread?.setPointerLock(status)
		);

		this.controller.key$.subscribe((keyEvent) =>
			this.coreThread?.keyEvent(keyEvent)
		);
	}
}

export const QuickThree = (props?: MainDto) => {
	const mainProps = new MainDto();
	mainProps.canvas = props?.canvas;

	container.register(MainDto.name, { useValue: mainProps });
	container.resolve(Main);
};

if (process.env.NODE_ENV !== "production") QuickThree();
