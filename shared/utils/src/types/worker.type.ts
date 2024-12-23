import { spawn, Worker } from "threads";
import { WorkerFunction, WorkerModule } from "threads/dist/types/worker";
import { ThreadsWorkerOptions } from "threads/dist/types/master";

/**
 * @description {@link WorkerModule} representation.
 *
 * @see https://threads.js.org/usage#module-worker
 */
export interface WorkerThreadModule {}

export type ExposedWorkerThreadModule<
	T extends WorkerThreadModule = WorkerThreadModule
> = WorkerModule<Exclude<keyof T, number | symbol>>;

export type SpawnProps = Parameters<typeof spawn>;

export type SpawnedThread<T extends WorkerFunction | WorkerModule<any>> =
	ReturnType<typeof spawn<T>>;

export type AwaitedSpawnedThread<T extends WorkerFunction | WorkerModule<any>> =
	SpawnedThread<T> extends Promise<infer U> ? U : SpawnedThread<T>;

export type WorkerThreadProps = {
	onTerminate?: () => void;
	onError?: (err: any) => void;
};

export type WorkerThreadPayload = {
	path: string | URL;
	subject: Transferable | object;
	transferSubject?: Transferable[];
};

export type WorkerThreadTask = {
	payload: WorkerThreadPayload;
	options?: {
		spawn: SpawnProps["1"];
		worker: ThreadsWorkerOptions;
	};
};

/** @description `Run` method result. */
export type WorkerThreadResolution<
	T extends WorkerFunction | WorkerModule<any>
> = {
	/**
	 * @description The Module {@link Worker}
	 *
	 * @see https://threads.js.org/usage#function-worker
	 */
	worker?: Worker;
	/**
	 * @description The Spawned thread {@link Worker}
	 *
	 * @see https://threads.js.org/usage#spawn
	 */
	thread?: AwaitedSpawnedThread<T>;
};
