import { expose, registerSerializer } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils/dist/types/worker";

import { CoreModule, coreModule } from "./core.module";
import { coreModuleSerializer } from "./core.module-serializer";

export type ExposedCoreModule = ExposedWorkerThreadModule<CoreModule>;

registerSerializer(coreModuleSerializer);

expose({
	lifecycle$: coreModule.lifecycle$.bind(coreModule),
	setSize: coreModule.setSize.bind(coreModule),
	setPointerLock: coreModule.setPointerLock.bind(coreModule),
	mouseMove: coreModule.mouseMove.bind(coreModule),
	keyEvent: coreModule.keyEvent.bind(coreModule),
	dispose: coreModule.dispose.bind(coreModule),
	init: () => {}
} satisfies ExposedCoreModule);
