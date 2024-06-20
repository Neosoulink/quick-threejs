import { expose, registerSerializer } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";

import { CoreModule, coreModule } from "./core.module";
import { EventStatus } from "../common/enums/event.enum";
import { object3DSerializer } from "../common/serializers/object3d.serializer";
import { LaunchAppProps } from "../common/interfaces/module.interface";
import { Methods } from "../common/types/object.type";

registerSerializer(object3DSerializer);

export const launchApp = (props?: LaunchAppProps) => {
	coreModule.lifecycle$().subscribe((state) => {
		if (state === EventStatus.ON && props?.onReady) props.onReady(coreModule);
	});

	return coreModule;
};

expose({
	lifecycle$: coreModule.lifecycle$.bind(coreModule),
	setSize: coreModule.setSize.bind(coreModule),
	dispose: coreModule.dispose.bind(coreModule),
	isInitialized: coreModule.isInitialized.bind(coreModule),
	init: () => {}
} satisfies ExposedCoreModule);

export type ExposedCoreModule = ExposedWorkerThreadModule<Methods<CoreModule>>;
