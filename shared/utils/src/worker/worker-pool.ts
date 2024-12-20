import { WorkerThread } from "./worker-thread";
import {
	ExposedWorkerThreadModule,
	WorkerThreadResolution,
	WorkerThreadTask
} from "../types/worker.type";

/**
 * @description {@link WorkerThread} Pool.
 *
 * Create a list of available worker threads based on the `maxWorkersCount` count.
 *
 * - Use the `run` method to execute a {@link WorkerThreadTask Task} on the next available worker thread.
 * - Will queue tasks if no worker threads are available.
 */
export class WorkerPool {
	private _workerThreads: WorkerThread[] = [];
	private _tasksQueue: WorkerThreadTask[] = [];

	constructor(
		public readonly maxWorkersCount: number,
		public debugMode: boolean,
		public onWorkerThreadRun?: (
			workerThread?: WorkerThread<ExposedWorkerThreadModule>
		) => void
	) {
		for (let i = 0; i < this.maxWorkersCount; i++)
			this._workerThreads.push(this._createWorkerThread());
	}

	private _handleWorkerThreadTerminate(worker: WorkerThread) {
		if (this.debugMode) console.log(`WorkerThread #${worker.id} freed`);

		this.runNext();
	}

	private _handleWorkerThreadError(error: any, workerThread: WorkerThread) {
		console.error(`Error from worker #${workerThread.id}:`, error);

		this.runNext();
	}

	private _createWorkerThread() {
		const workerThread = new WorkerThread({
			onTerminate: () => this._handleWorkerThreadTerminate(workerThread),
			onError: (err) => this._handleWorkerThreadError(err, workerThread)
		});

		return workerThread;
	}

	public get workerThreads() {
		return this._workerThreads;
	}

	public get tasksQueue() {
		return this._tasksQueue;
	}

	public get nextAvailableWorkerThread() {
		return this._workerThreads.find((w) => w.idle);
	}

	public getAvailableWorkerThreads(invert = false) {
		return this._workerThreads.filter((w) => (invert ? !w.idle : w.idle));
	}

	/** @description Will attempt to run the next task in the queue. */
	public async runNext() {
		if (!this.nextAvailableWorkerThread || this._tasksQueue.length === 0)
			return;
		const nextTask = this._tasksQueue.shift();

		if (nextTask) await this.run(nextTask);
	}

	/**
	 * @description
	 *
	 * Run a {@link WorkerThreadTask Task} on the next available worker thread.
	 *
	 * If no worker threads are available, the task will be queued.
	 *
	 * @param task The {@link WorkerThreadTask Task} to run.
	 * @param immediate Immediately run the task on an untracked worker thread.
	 */
	public async run<
		T extends ExposedWorkerThreadModule = ExposedWorkerThreadModule
	>(
		task: WorkerThreadTask,
		immediate = false
	): Promise<
		[workerThread: WorkerThreadResolution<T> | undefined, queued: boolean]
	> {
		if (immediate) {
			const workerThread = this._createWorkerThread();

			if (this.debugMode)
				console.log(
					`Running On Untracked Thread #${workerThread?.id}. Task:`,
					task
				);

			return [await workerThread.run<T>(task), false];
		}

		const availableWorkerThread = this.nextAvailableWorkerThread;

		if (!availableWorkerThread) {
			this._tasksQueue.push(task);
			if (this.debugMode) console.log("Queued Thread Task:", task);
			return [undefined, true];
		}

		if (this.debugMode)
			console.log(
				`Running On Thread #${availableWorkerThread?.id}. Task:`,
				task
			);

		const workerThread = await availableWorkerThread.run<T>(task);
		this.onWorkerThreadRun?.(availableWorkerThread);

		return [workerThread, false];
	}

	/**
	 * @description Terminate all worker threads.
	 *
	 * @note Will not terminate untracked worker-threads.
	 */
	public async terminateAll() {
		this._tasksQueue = [];
		await Promise.all(this._workerThreads.map((wt) => wt.terminate()));
	}
}
