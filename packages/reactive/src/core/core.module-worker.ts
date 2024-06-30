import { expose, registerSerializer } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";
import type { WorkerFunction } from "threads/dist/types/worker";

import { CoreModule, coreModule } from "./core.module";
import { object3DSerializer } from "../common/serializers/object3d.serializer";
import { CoreLifecycleState } from "../common/enums/lifecycle.enum";
import { PROXY_EVENT_LISTENERS } from "../common/constants/event.constants";
import type { LaunchAppProps } from "../common/interfaces/module.interface";
import type {
	Methods,
	ProxyEventListenerKeys
} from "../common/types/object.type";

registerSerializer(object3DSerializer);

export const launchApp = (props?: LaunchAppProps) => {
	coreModule.lifecycle$().subscribe((state) => {
		if (state === CoreLifecycleState.INITIALIZED && props?.onReady)
			props.onReady(coreModule);
	});

	return coreModule;
};

const proxyEventHandlers: {
	[key in (typeof PROXY_EVENT_LISTENERS)[number]]: WorkerFunction;
} = {} as any;
const proxyObservables: {
	[key in `${ProxyEventListenerKeys}$`]: WorkerFunction;
} = {} as any;

PROXY_EVENT_LISTENERS.forEach((key) => {
	proxyEventHandlers[key] = coreModule[key]?.bind?.(coreModule);
});

expose({
	...proxyEventHandlers,
	...proxyObservables,
	init: () => {},
	dispose: coreModule.dispose.bind(coreModule),
	isInitialized: coreModule.isInitialized.bind(coreModule),
	lifecycle$: coreModule.lifecycle$.bind(coreModule)
} satisfies ExposedCoreModule);

export type ExposedCoreModule = ExposedWorkerThreadModule<Methods<CoreModule>>;
