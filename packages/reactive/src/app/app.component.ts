import { singleton } from "tsyringe";
import { workerPool } from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils/dist/types/worker.type";

import { ExposedCoreModule } from "../core/core.module-worker";

@singleton()
export class AppComponent {
	public readonly workerPool = workerPool();

	public canvas!: HTMLCanvasElement;
	public core!: WorkerThreadResolution<ExposedCoreModule>;
}
