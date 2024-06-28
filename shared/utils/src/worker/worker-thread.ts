import { spawn, Thread, Worker } from "threads";
import { Observable } from "threads/observable";

import {
	AwaitedSpawnedThread,
	ExposedWorkerThreadModule,
	WorkerThreadResolution,
	WorkerThreadProps,
	WorkerThreadTask
} from "../types/worker.type";

let auto_increment_unique_id = -1;

/**
 *
 */
export class WorkerThread<
	T extends ExposedWorkerThreadModule = ExposedWorkerThreadModule
> {
	private _handleComplete: WorkerThreadProps["complete"];
	private _handleError: WorkerThreadProps["error"];

	public id = (auto_increment_unique_id += 1);
	public idle = true;
	public worker?: Worker;
	public thread?: AwaitedSpawnedThread<T>;

	constructor(handlers?: WorkerThreadProps) {
		this._handleComplete = handlers?.complete;
		this._handleError = handlers?.error;
	}

	public async run<U extends T = T>({
		payload,
		options
	}: WorkerThreadTask): Promise<WorkerThreadResolution<U>> {
		try {
			this.idle = false;
			this.worker = new Worker(payload.path as string, {
				type: "module",
				...options?.worker
			});
			this.thread = await spawn<T>(this.worker, {
				timeout: 10000,
				...options?.spawn
			});
			const threadLifecycle = this.thread?.lifecycle$?.();

			if (!(threadLifecycle instanceof Observable))
				throw new Error(
					"Worker Module Incompatible. Missing #lifecycle observable."
				);

			this.worker.postMessage(payload.subject, payload.transferSubject);

			threadLifecycle.subscribe({
				complete: this._handleComplete,
				error: this._handleError
			});

			return {
				worker: this.worker,
				thread: this.thread
			};
		} catch (err: any) {
			this._handleError?.(err);
			return {};
		}
	}

	terminate() {
		this.worker?.terminate();
		this.thread && Thread.terminate(this.thread);
		this.worker = undefined;
		this.thread = undefined;
		this.idle = true;
	}
}
