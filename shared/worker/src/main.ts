import { getSafeAvailableCoresCount } from "@quick-threejs/utils";

import { WorkerPool } from "./pool";

export const createWorkerPool = (maxWorkers?: number, debug?: boolean) => {
	return new WorkerPool(maxWorkers || getSafeAvailableCoresCount(), !!debug);
};

export * from "./types/";
export * from "./tokens/";

export * from "./thread";
export * from "./pool";
