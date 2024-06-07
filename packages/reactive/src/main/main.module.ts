import "reflect-metadata";

import { WorkerImplementation } from "threads/dist/types/master";
import { spawn, Worker } from "threads";
import { container, inject, singleton } from "tsyringe";
import { WorkerModule } from "threads/dist/types/worker";

import { MainDto } from "./dto/main.dto";
import { MainController } from "./main.controller";
import type { ExposedCoreModule } from "../core/core.module";
import { Module } from "../common/interfaces/module.interface";
import { GuiModule } from "./gui/gui.module";

@singleton()
class MainModule implements Module {
	private canvas!: HTMLCanvasElement;
	private core?: ExposedCoreModule;
	private coreWorker?: WorkerImplementation;

	constructor(
		@inject(MainController) private readonly controller: MainController,
		@inject(MainDto.name) private readonly props: MainDto,
		@inject(GuiModule) private readonly guiModule: GuiModule
	) {
		this.init(document.createElement("canvas"));
	}

	public init(canvas: HTMLCanvasElement): void {
		this.initCanvas(canvas);
		this.initGui();
		this.initCoreThread();
	}

	private initGui() {
		this.guiModule.init(this.canvas);
	}

	private initCanvas(canvas: HTMLCanvasElement) {
		try {
			this.canvas = canvas;

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

		return [thread, worker] as const;
	}

	private initCoreThread() {
		const offscreenCanvas = this.canvas.transferControlToOffscreen();
		offscreenCanvas.width = this.canvas.clientWidth;
		offscreenCanvas.height = this.canvas.clientHeight;

		this.initThread<ExposedCoreModule>(
			new Worker(
				new URL("../core/core.module.ts", import.meta.url) as unknown as string,
				{
					type: "module"
				}
			)
		).then(([core, coreWorker]) => {
			this.core = core;
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
			this.core?.mouseMove(event.x, event.y)
		);

		this.controller.resize$.subscribe(() =>
			this.core?.setSize(window.innerWidth, window.innerHeight)
		);

		this.controller.pointerLock$.subscribe((status) =>
			this.core?.setPointerLock(status)
		);

		this.controller.key$.subscribe((keyEvent) => this.core?.keyEvent(keyEvent));
	}
}

export const QuickThree = (props?: MainDto) => {
	const mainProps = new MainDto();
	mainProps.canvas = props?.canvas;

	container.register(MainDto.name, { useValue: mainProps });
	container.resolve(MainModule);
};

if (process.env.NODE_ENV !== "production") QuickThree();
