import { expose, registerSerializer } from "threads/worker";

import { coreModule, ExposedCoreModule } from "./core.module";
import { coreModuleSerializer } from "./core.module-serializer";

registerSerializer(coreModuleSerializer);

expose({
	setSize: coreModule.setSize.bind(coreModule),
	setPointerLock: coreModule.setPointerLock.bind(coreModule),
	mouseMove: coreModule.mouseMove.bind(coreModule),
	keyEvent: coreModule.keyEvent.bind(coreModule),
	lifecycle: coreModule.lifecycle.bind(coreModule),
	init: () => {}
} satisfies ExposedCoreModule);
