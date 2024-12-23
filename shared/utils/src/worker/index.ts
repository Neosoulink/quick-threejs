import { getSafeAvailableCoresCount } from "../hardware";
import { WorkerPool } from "./worker-pool";

export const createWorkerPool = (maxWorkers?: number, debug?: boolean) => {
	return new WorkerPool(maxWorkers || getSafeAvailableCoresCount(), !!debug);
};

export * from "./worker-thread";
export * from "./worker-pool";
