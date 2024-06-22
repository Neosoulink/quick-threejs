import { container, inject, singleton } from "tsyringe";

import { WorkerThread } from "./worker-thread";
import { getSafeAvailableCoresNumber } from "../hardware";
import {
	ExposedWorkerThreadModule,
	WorkerThreadResolution,
	WorkerThreadTask
} from "../types/worker.type";

@singleton()
/**
 * @internal
 */
class WorkerPool {
	private _workerThreads: WorkerThread[] = [];
	private _taskQueue: WorkerThreadTask[] = [];

	constructor(@inject(WorkerPool.name) private readonly _maxWorkers: number) {
		for (let i = 0; i < this._maxWorkers; i++) {
			const workerThread = new WorkerThread({
				complete: () => this._handleWorkerMessage(workerThread),
				error: (err) => this._handleWorkerError(err, workerThread)
			});
			this._workerThreads.push(workerThread);
		}
	}

	private _runNext(thread: WorkerThread) {
		thread.terminate();

		if (this._taskQueue.length > 0) {
			const nextTask = this._taskQueue.shift();
			nextTask && this.run(nextTask);
		}
	}

	private _handleWorkerMessage(worker: WorkerThread) {
		console.log(`Thread #${worker.id} execution completed`);

		this._runNext(worker);
	}

	private _handleWorkerError(error: Error, worker: WorkerThread) {
		console.error(`Error from worker #${worker.id}:`, error);

		this._runNext(worker);
	}

	public get maxWorkers() {
		return this._maxWorkers;
	}

	public get workerThreads() {
		return this._workerThreads;
	}

	public get taskQueue() {
		return this._taskQueue;
	}

	public async run<
		T extends ExposedWorkerThreadModule = ExposedWorkerThreadModule
	>(
		task: WorkerThreadTask,
		immediate = false
	): Promise<WorkerThreadResolution<T>> {
		if (immediate) {
			const workerThread = new WorkerThread({
				complete: () => this._handleWorkerMessage(workerThread),
				error: (err) => this._handleWorkerError(err, workerThread)
			});

			console.log(
				`Running On Untracked Thread #${workerThread?.id}. Task:`,
				task
			);

			// Unknown error on the NodeJs console.
			// <Untyped function calls may not accept type arguments.>
			// @ts-ignore
			return await workerThread.run<T>(task);
		}

		const availableWorkerThread = this._workerThreads.find((w) => w.idle);

		if (!availableWorkerThread) {
			this._taskQueue.push(task);

			console.log("Queued Thread Task:", task);
			return {};
		}

		console.log(`Running On Thread #${availableWorkerThread?.id}. Task:`, task);

		return await availableWorkerThread.run<T>(task);
	}

	public terminateAll() {
		this._workerThreads.forEach((w) => w.terminate());
	}
}

export const workerPool = (maxWorkers?: number) => {
	container.register(WorkerPool.name, {
		useValue: maxWorkers || getSafeAvailableCoresNumber()
	});
	return container.resolve(WorkerPool);
};

export * from "./worker-thread";
