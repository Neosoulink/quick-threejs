import { spawn, Worker } from "threads";
import { WorkerFunction, WorkerModule } from "threads/dist/types/worker";
import { ThreadsWorkerOptions } from "threads/dist/types/master";

import type { Observable } from "rxjs";

/**
 * @description Represent the worker threaded module. Extends {@link WorkerModule}
 *
 * @see https://threads.js.org
 */
export interface WorkerThreadModule {
	/**
	 * @description Lifecycle observable getter.
	 *
	 * __Internally used for `worker-thread` completion detection
	 * (when `complete` is triggered).__
	 */
	lifecycle$: () => Observable<unknown>;
}

export type ExposedWorkerThreadModule<
	T extends WorkerThreadModule = WorkerThreadModule
> = WorkerModule<Exclude<keyof T, number | symbol>>;

export type SpawnProps = Parameters<typeof spawn>;

export type SpawnedThread<T extends WorkerFunction | WorkerModule<any>> =
	ReturnType<typeof spawn<T>>;

export type AwaitedSpawnedThread<T extends WorkerFunction | WorkerModule<any>> =
	SpawnedThread<T> extends Promise<infer U> ? U : SpawnedThread<T>;

export type WorkerThreadProps = {
	complete?: () => void;
	error?: (error: Error) => void;
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
