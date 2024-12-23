import { singleton } from "tsyringe";
import { createWorkerPool } from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils";

import { ExposedAppModule } from "../app/app.module-worker";

@singleton()
export class RegisterService {
	public readonly workerPool = createWorkerPool(undefined, true);

	public canvas?: HTMLCanvasElement;
	public worker?: WorkerThreadResolution<ExposedAppModule>["worker"];
	public thread?: WorkerThreadResolution<ExposedAppModule>["thread"];

	init(app: WorkerThreadResolution<ExposedAppModule>) {
		this.worker = app.worker;
		this.thread = app.thread;
	}
}
