import { singleton } from "tsyringe";
import { createWorkerPool } from "@quick-threejs/utils";
import { WorkerThreadResolution } from "@quick-threejs/utils/dist/types/worker.type";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "stats.js";

import { ExposedAppModule } from "../app/app.module-worker";

@singleton()
export class RegisterComponent {
	public readonly workerPool = createWorkerPool();

	public canvas!: HTMLCanvasElement;
	public worker!: WorkerThreadResolution<ExposedAppModule>["worker"];
	public thread!: WorkerThreadResolution<ExposedAppModule>["thread"];
	public gui?: GUI;
	public stats?: Stats;

	init(app: WorkerThreadResolution<ExposedAppModule>) {
		this.worker = app.worker;
		this.thread = app.thread;
		this.gui = new GUI();
		this.stats = Stats && new Stats();
		this.stats.showPanel(0);

		if (!window) return;

		window.document.body.appendChild(this.stats.dom);
		if (window.innerWidth <= 450) this.gui.close();
	}
}
