import { expose, registerSerializer } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils/dist/types/worker";

import { CoreModule, coreModule } from "./core.module";
import { coreModuleSerializer } from "./core.module-serializer";

export type ExposedCoreModule = ExposedWorkerThreadModule<CoreModule>;

registerSerializer(coreModuleSerializer);

expose({
	lifecycle$: coreModule.lifecycle$.bind(coreModule),
	step$: coreModule.step$.bind(coreModule),
	setSize: coreModule.setSize.bind(coreModule),
	setTimerStatus: coreModule.setTimerStatus.bind(coreModule),
	dispose: coreModule.dispose.bind(coreModule),
	init: () => {}
} satisfies ExposedCoreModule);
