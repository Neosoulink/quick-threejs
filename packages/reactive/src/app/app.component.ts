import { singleton } from "tsyringe";
import { createWorkerPool, WorkerPool } from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils/dist/types/worker.type";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "stats.js";

import { ExposedCoreModule } from "../core/core.module-worker";

@singleton()
export class AppComponent {
	public readonly workerPool = createWorkerPool() as unknown as WorkerPool;

	public gui?: GUI;
	public stats?: Stats;
	public canvas!: HTMLCanvasElement;
	public core!: WorkerThreadResolution<ExposedCoreModule>;

	init(core: typeof this.core) {
		this.core = core;
		this.gui = new GUI();
		this.stats = new Stats();
		this.stats.showPanel(0);

		if (!window) return;

		window.document.body.appendChild(this.stats.dom);
		if (window.innerWidth <= 450) this.gui.close();
	}
}
