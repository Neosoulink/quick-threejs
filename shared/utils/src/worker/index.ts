import { container, inject, singleton } from "tsyringe";

import { WorkerThread } from "./worker-thread";
import { getSafeAvailableCoresNumber } from "../hardware";
import { ThreadsWorkerOptions } from "threads/dist/types/master";

@singleton()
class _WorkerPool {
	private _workers: WorkerThread[] = [];
	private _taskQueue: { path: string; task: Transferable }[] = [];

	constructor(@inject(_WorkerPool.name) private readonly _maxWorkers) {
		for (let i = 0; i < this._maxWorkers; i++) {
			const worker = new WorkerThread({
				complete: () => this._handleWorkerMessage(worker),
				error: (err) => this._handleWorkerError(err, worker)
			});
			this._workers.push(worker);
		}
	}

	private _runNextTask(worker: WorkerThread) {
		worker.idle = true;
		worker.terminate();

		if (this._taskQueue.length > 0) {
			const nextTask = this._taskQueue.shift();
			nextTask && this.runTask(nextTask.path, nextTask.task);
		}
	}

	private _handleWorkerMessage(worker: WorkerThread) {
		console.log(`Worker #${worker.id} execution completed`);

		this._runNextTask(worker);
	}

	private _handleWorkerError(error: Error, worker: WorkerThread) {
		console.error(`Error from worker #${worker.id}:`, error);

		this._runNextTask(worker);
	}

	public get maxWorkers() {
		return this._maxWorkers;
	}

	public get workers() {
		return this._workers;
	}

	public get taskQueue() {
		return this._taskQueue;
	}

	public async runTask(
		path: string,
		task: any,
		transfer?: Transferable[],
		workerOptions: ThreadsWorkerOptions = { type: "module" }
	) {
		const availableWorker = this._workers.find((w) => w.idle);
		const _task = { path, task };

		if (!availableWorker) {
			this._taskQueue.push(_task);

			console.log("Queued worker task:", _task);
			return {};
		}

		console.log(`Running on worker #${availableWorker?.id}. task:`, _task);

		availableWorker.idle = false;
		return await availableWorker.exec(path, task, workerOptions, transfer);
	}

	public terminateAll() {
		this._workers.forEach((w) => w.terminate());
		this._workers = [];
	}
}

export const WorkerPool = (maxWorkers?: number) => {
	container.register(_WorkerPool.name, {
		useValue: maxWorkers || getSafeAvailableCoresNumber()
	});
	return container.resolve(_WorkerPool);
};

export * from "./worker-thread";
