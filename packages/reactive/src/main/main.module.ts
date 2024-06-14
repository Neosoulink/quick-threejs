import "reflect-metadata";

import { container, inject, singleton } from "tsyringe";
import { registerSerializer, Worker } from "threads";
import { WorkerPool } from "@quick-threejs/utils";

import { Module } from "../common/interfaces/module.interface";
import { MainDto } from "./dto/main.dto";
import { MainController } from "./main.controller";
import { GuiModule } from "./gui/gui.module";
import { ExposedLoaderModule, Source } from "../loader/loader.module";
import { ExposedCoreModule } from "../core/core.module";
import { coreModuleSerializer } from "../core/core.module-serializer";
import { AwaitedSpawnedThread } from "@quick-threejs/utils/dist/types/worker";

@singleton()
class MainModule implements Module {
	private _workerPool = WorkerPool();
	private _canvas!: HTMLCanvasElement;
	private _core!: {
		thread: AwaitedSpawnedThread<ExposedCoreModule>;
		worker: Worker;
	};

	constructor(
		@inject(MainController) private readonly controller: MainController,
		@inject(MainDto.name) private readonly props: MainDto,
		@inject(GuiModule) private readonly guiModule: GuiModule
	) {
		this.init();
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

	private async _initCore() {
		const offscreenCanvas = this._canvas.transferControlToOffscreen();
		offscreenCanvas.width = this._canvas.clientWidth;
		offscreenCanvas.height = this._canvas.clientHeight;

		const core = await this._workerPool.run<ExposedCoreModule>({
			payload: {
				path: new URL("../core/core.module-worker.ts", import.meta.url),
				subject: { canvas: offscreenCanvas },
				transferSubject: [offscreenCanvas]
			}
		});
		const worker = core.worker;
		const thread = core.thread;

		if (thread && worker) {
			this._core = {
				worker,
				thread
			};

			this._initController();
		}
	}

	private async _initLoader() {
		const loaderWorker = await this._workerPool.run({
			payload: {
				path: new URL("../loader/loader.module.ts", import.meta.url),
				subject: {
					sources: [
						{
							type: "texture",
							path: "https://avatars.githubusercontent.com/u/44310540?v=4",
							name: "image"
						}
					]
				} satisfies {
					sources: Source[];
				}
			}
		});

		const loader = loaderWorker.thread as unknown as ExposedLoaderModule;
		loader.startLoading();
	}

	private _initController(): void {
		this.controller.init(this._canvas);

		this.controller.mouseMove$.subscribe((event) =>
			this._core.thread?.mouseMove(event.x, event.y)
		);

		this.controller.resize$.subscribe(() =>
			this._core.thread?.setSize(window.innerWidth, window.innerHeight)
		);

		this.controller.pointerLock$.subscribe((status) =>
			this._core.thread?.setPointerLock(status)
		);

		this.controller.key$.subscribe((keyEvent) =>
			this._core.thread?.keyEvent(keyEvent)
		);
	}

	public async init() {
		registerSerializer(coreModuleSerializer);

		this._initCanvas();
		this._initLoader();
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
