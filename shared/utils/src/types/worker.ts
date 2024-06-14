import { spawn } from "threads";
import { Observable } from "threads/observable";
import { WorkerFunction, WorkerModule } from "threads/dist/types/worker";
import { ThreadsWorkerOptions } from "threads/dist/types/master";

/**
 * @description Represent the worker threaded module. Extends {@link WorkerModule}
 *
 * @see https://threads.js.org
 */
export interface WorkerThreadModule {
	lifecycle: () => Observable<unknown>;
}

export type ExposedWorkerThreadModule<
	T extends WorkerThreadModule = WorkerThreadModule
> = WorkerModule<Exclude<keyof T, number | symbol>>;

export type SpawnProps = Parameters<typeof spawn>;

export type SpawnedThread<T extends WorkerFunction | WorkerModule<any>> =
	ReturnType<typeof spawn<T>>;

export type AwaitedSpawnedThread<T extends WorkerFunction | WorkerModule<any>> =
	SpawnedThread<T> extends Promise<infer U> ? U : SpawnedThread<T>;

export interface WorkerThreadProps {
	complete?: () => void;
	error?: (error: Error) => void;
}

export interface WorkerThreadPayload {
	path: string | URL;
	subject: Transferable | object;
	transferSubject?: Transferable[];
}

export interface WorkerThreadTask {
	payload: WorkerThreadPayload;
	options?: {
		spawn: SpawnProps["1"];
		worker: ThreadsWorkerOptions;
	};
}
