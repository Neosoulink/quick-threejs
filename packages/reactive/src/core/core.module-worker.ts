import { expose, registerSerializer } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";

import { CoreModule, coreModule } from "./core.module";
import { object3DSerializer } from "../common/serializers/object3d.serializer";

export type ExposedCoreModule = ExposedWorkerThreadModule<CoreModule>;

registerSerializer(object3DSerializer);

expose({
	lifecycle$: coreModule.lifecycle$.bind(coreModule),
	step$: coreModule.step$.bind(coreModule),
	setSize: coreModule.setSize.bind(coreModule),
	setTimerStatus: coreModule.setTimerStatus.bind(coreModule),
	dispose: coreModule.dispose.bind(coreModule),
	scene: coreModule.scene.bind(coreModule),
	init: () => {}
} satisfies ExposedCoreModule);
