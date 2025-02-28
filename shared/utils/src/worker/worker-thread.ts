import { spawn, Thread, Worker } from "threads";

import {
	AwaitedSpawnedThread,
	ExposedWorkerThreadModule,
	WorkerThreadProps,
	WorkerThreadTask
} from "../types/worker.type";
import { TERMINATE_THREAD_FROM_WORKER_TOKEN } from "../tokens";

let auto_increment_unique_id = -1;

/**
 * @description
 *
 * [Threads](https://github.com/andywer/threads.js) based class.
 * Contains a worker and a spawned thread.
 *
 * - Use the `run` method to execute a {@link WorkerThreadTask Task} and initialize the {@link Worker} & {@link AwaitedSpawnedThread Thread}.
 *
 * @see https://threads.js.org/getting-started
 */
export class WorkerThread<
	T extends ExposedWorkerThreadModule = ExposedWorkerThreadModule
> {
	private _handleTerminate: WorkerThreadProps["onTerminate"];
	private _handleError: WorkerThreadProps["onError"];
	private _task?: WorkerThreadTask;

	public id = (auto_increment_unique_id += 1);
	public idle = true;
	public worker?: Worker;
	public thread?: AwaitedSpawnedThread<T>;

	constructor(props?: WorkerThreadProps) {
		this._handleTerminate = props?.onTerminate;
		this._handleError = props?.onError;
	}

	private _handleMessages(payload: Event) {
		if (
			payload instanceof MessageEvent &&
			payload.data?.token === TERMINATE_THREAD_FROM_WORKER_TOKEN
		)
			this.terminate();
	}

	public async run<U extends T = T>(
		task: WorkerThreadTask
	): Promise<WorkerThread<U> | undefined> {
		try {
			const { payload, options } = task;

			this.idle = false;
			this.worker = new Worker(payload.path as string, {
				type: "module",
				...options?.worker
			});
			this.thread = await spawn<T>(this.worker, {
				timeout: 10000,
				...options?.spawn
			});
			this._task = task;

			this.worker.postMessage(payload.subject, payload.transferSubject);
			this.worker.addEventListener("message", this._handleMessages.bind(this));

			return this;
		} catch (err: any) {
			this._handleError?.(err);
			return undefined;
		}
	}

	public get task() {
		return this._task;
	}

	public async terminate() {
		this.worker?.removeEventListener(
			"message",
			this._handleMessages.bind(this)
		);

		if (this.thread) await Thread.terminate(this.thread);
		await this.worker?.terminate();

		this.worker = undefined;
		this.thread = undefined;
		this._task = undefined;
		this.idle = true;

		this._handleTerminate?.();
	}
}
