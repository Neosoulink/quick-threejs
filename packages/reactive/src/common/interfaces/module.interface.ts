/* eslint-disable @typescript-eslint/no-unused-vars */

import type { DependencyContainer, Disposable } from "tsyringe";

import type { RegisterPropsBlueprint } from "../blueprints";

/**
 * @description Module representation.
 *
 * @important Each module should `implement` this interface.
 */
export interface Module extends Disposable {
	/**
	 * @description Module initializer method.
	 *
	 * Can be used for on-launch initialization (when the app is constructed) if the {@link RegisterPropsBlueprint.initOnConstruct initOnConstruct} param is `true` or manually later in the code.
	 */
	init(...props: any[]): void;

	/**
	 * @description Module disposal.
	 *
	 * Used to terminate the Module execution and free memory.
	 */
	dispose(): void;
}

/**
 * @description Containerized App representation.
 */
export interface ContainerizedApp<M extends Module = Module> {
	container: DependencyContainer;
	module: M;
}
