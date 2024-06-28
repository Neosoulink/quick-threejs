import { expose, registerSerializer } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";

import { CoreModule, coreModule } from "./core.module";
import { object3DSerializer } from "../common/serializers/object3d.serializer";
import type { LaunchAppProps } from "../common/interfaces/module.interface";
import type { Methods } from "../common/types/object.type";
import { PROXY_EVENT_LISTENERS } from "../common/constants/event.constants";
import { WorkerFunction } from "threads/dist/types/worker";
import { LifecycleState } from "../common/enums/lifecycle.enum";

registerSerializer(object3DSerializer);

export const launchApp = (props?: LaunchAppProps) => {
	coreModule.lifecycle$().subscribe((state) => {
		if (state === LifecycleState.INITIALIZED && props?.onReady)
			props.onReady(coreModule);
	});

	return coreModule;
};

const proxyEvents: {
	[key in (typeof PROXY_EVENT_LISTENERS)[number]]?: WorkerFunction;
} = {};
PROXY_EVENT_LISTENERS.forEach((key) => {
	proxyEvents[key] = coreModule[key].bind(coreModule);
});

expose({
	...proxyEvents,
	init: () => {},
	dispose: coreModule.dispose.bind(coreModule),
	isInitialized: coreModule.isInitialized.bind(coreModule),
	lifecycle$: coreModule.lifecycle$.bind(coreModule)
} satisfies ExposedCoreModule);

export type ExposedCoreModule = ExposedWorkerThreadModule<Methods<CoreModule>> &
	typeof proxyEvents;
