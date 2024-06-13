import "reflect-metadata";

import { WorkerImplementation } from "threads/dist/types/master";
import { spawn, Worker } from "threads";
import { WorkerModule } from "threads/dist/types/worker";
import { container, inject, singleton } from "tsyringe";

import { Module } from "../common/interfaces/module.interface";
import { MainDto } from "./dto/main.dto";
import { MainController } from "./main.controller";
import { GuiModule } from "./gui/gui.module";
import type { ExposedCoreModule } from "../core/core.module";
import { WorkerPool } from "@quick-threejs/utils";

@singleton()
class MainModule implements Module {
	private _canvas!: HTMLCanvasElement;
	private _coreModule?: ExposedCoreModule;
	private _coreWorker?: WorkerImplementation;

	constructor(
		@inject(MainController) private readonly controller: MainController,
		@inject(MainDto.name) private readonly props: MainDto,
		@inject(GuiModule) private readonly guiModule: GuiModule
	) {
		// this.init();
		const pool = WorkerPool();
		pool.runTask(
			new URL(
				"../differed/differed.module.ts",
				import.meta.url
			) as unknown as string,
			{ subject: "some string here" }
		);
		pool.runTask(
			new URL(
				"../differed/differed.module.ts",
				import.meta.url
			) as unknown as string,
			{ subject: "some string here" }
		);
		pool.runTask(
			new URL(
				"../differed/differed.module.ts",
				import.meta.url
			) as unknown as string,
			{ subject: "some string here" }
		);
		pool.runTask(
			new URL(
				"../differed/differed.module.ts",
				import.meta.url
			) as unknown as string,
			{ subject: "some string here" }
		);
	}

	private _initCanvas() {
		try {
			this._canvas = document.createElement("canvas");

			if (this.props.canvas instanceof HTMLCanvasElement)
				this._canvas = this.props.canvas;

			if (typeof this.props.canvas === "string") {
				const canvas_ = document.querySelector(this.props.canvas as string);

				if (canvas_ instanceof HTMLCanvasElement) this._canvas = canvas_;
			}

			if (!this._canvas.parentElement) document.body.appendChild(this._canvas);
		} catch (err: any) {
			console.error(
				`🛑 Unable to initialize the canvas:\n${err?.message ?? "Something went wrong"}`
			);
		}
	}

	private _initGui() {
		this.guiModule.init(this._canvas);
	}

	private async _initCoreThread<T extends object>(
		worker: WorkerImplementation
	) {
		const thread =
			await spawn<WorkerModule<Exclude<keyof T, number | symbol>>>(worker);

		return [thread, worker] as const;
	}

	private _initCore() {
		const offscreenCanvas = this._canvas.transferControlToOffscreen();
		offscreenCanvas.width = this._canvas.clientWidth;
		offscreenCanvas.height = this._canvas.clientHeight;

		this._initCoreThread<ExposedCoreModule>(
			new Worker(
				new URL("../core/core.module.ts", import.meta.url) as unknown as string,
				{
					type: "module"
				}
			)
		).then(([coreModule, coreWorker]) => {
			this._coreModule = coreModule;
			this._coreWorker = coreWorker;

			this._coreWorker.postMessage({ canvas: offscreenCanvas }, [
				offscreenCanvas
			]);

			this._initController();

			console.log("Core thread created");
		});
	}

	private _initController(): void {
		this.controller.init(this._canvas);

		this.controller.mouseMove$.subscribe((event) =>
			this._coreModule?.mouseMove(event.x, event.y)
		);

		this.controller.resize$.subscribe(() =>
			this._coreModule?.setSize(window.innerWidth, window.innerHeight)
		);

		this.controller.pointerLock$.subscribe((status) =>
			this._coreModule?.setPointerLock(status)
		);

		this.controller.key$.subscribe((keyEvent) =>
			this._coreModule?.keyEvent(keyEvent)
		);
	}

	public init(): void {
		this._initCanvas();
		this._initGui();
		this._initCore();
	}
}

export const QuickThree = (props?: MainDto) => {
	const mainProps = new MainDto();
	mainProps.canvas = props?.canvas;

	container.register(MainDto.name, { useValue: mainProps });
	return container.resolve(MainModule);
};

if (process.env.NODE_ENV !== "production") QuickThree();
