import { singleton } from "tsyringe";
import { createWorkerPool, WorkerPool } from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils/dist/types/worker.type";

import { ExposedCoreModule } from "../core/core.module-worker";

@singleton()
export class AppComponent {
	public readonly workerPool = createWorkerPool() as unknown as WorkerPool;

	public canvas!: HTMLCanvasElement;
	public core!: WorkerThreadResolution<ExposedCoreModule>;

	init(core: typeof this.core) {
		this.core = core;
	}
}
