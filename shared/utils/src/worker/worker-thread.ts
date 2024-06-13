import { spawn, Thread, Worker } from "threads";
import { Observable } from "threads/observable";
import { ThreadsWorkerOptions } from "threads/dist/types/master";
import { WorkerModule } from "threads/dist/types/worker";

let auto_increment_unique_id = -1;

export interface WorkerThreadModule {
	lifecycle: () => Observable<unknown>;
}

export class WorkerThread<T extends WorkerThreadModule = WorkerThreadModule> {
	public id = (auto_increment_unique_id += 1);
	public idle = true;
	public worker?: Worker;
	public thread?: Thread & T;
	public complete?: () => void;
	public error?: (error: Error) => void;

	constructor(handlers?: {
		complete?: WorkerThread["complete"];
		error?: WorkerThread["error"];
	}) {
		this.complete = handlers?.complete;
		this.error = handlers?.error;
	}

	public async exec(
		path: string,
		task?: any,
		options?: ThreadsWorkerOptions,
		transfer?: Transferable[]
	) {
		try {
			this.worker = new Worker(path, options);
			this.thread = (await spawn<
				WorkerModule<Exclude<keyof T, number | symbol>>
			>(this.worker, {
				timeout: 5000
			})) as unknown as typeof this.thread;

			if (typeof this.thread?.lifecycle !== "function")
				throw new Error(
					"Worker Module Incompatible. Missing lifecycle observable."
				);

			this.worker.postMessage(task, transfer);

			this.thread?.lifecycle().subscribe({
				complete: this.complete,
				error: this.error
			});

			return {
				worker: this.worker,
				thread: this.thread
			};
		} catch (err: any) {
			this.error?.(err);
			return {};
		}
	}

	terminate() {
		this.worker?.terminate();
		this.thread && Thread.terminate(this.thread);
	}
}
