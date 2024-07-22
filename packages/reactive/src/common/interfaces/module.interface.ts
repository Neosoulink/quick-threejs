/**
 * @description Module representation.
 *
 * @important Each module should `implement` this interface.
 */
export interface Module {
	/**
	 * @description Module initializer method.
	 *
	 * Can be used for direct initialization (when constructing `quick-three`) or manual (later in the code).
	 */
	init(...props: any[]): void;

	/**
	 * @description Module disposal.
	 *
	 * Used to terminate the Module execution and free memory.
	 */
	dispose(): void;
}
