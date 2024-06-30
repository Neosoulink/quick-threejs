import { expose, registerSerializer } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils/dist/types/worker.type";
import type { WorkerFunction } from "threads/dist/types/worker";

import { AppModule, appModule } from "./app.module";
import { object3DSerializer } from "../../common/serializers/object3d.serializer";
import { CoreLifecycleState } from "../../common/enums/lifecycle.enum";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";
import type { LaunchAppProps } from "../../common/interfaces/module.interface";
import type {
	Methods,
	ProxyEventListenerKeys
} from "../../common/types/object.type";

registerSerializer(object3DSerializer);

export const launchApp = (props?: LaunchAppProps) => {
	appModule.lifecycle$().subscribe((state) => {
		if (state === CoreLifecycleState.INITIALIZED && props?.onReady)
			props.onReady(appModule);
	});

	return appModule;
};

const proxyEventHandlers: {
	[key in (typeof PROXY_EVENT_LISTENERS)[number]]: WorkerFunction;
} = {} as any;
const proxyObservables: {
	[key in `${ProxyEventListenerKeys}$`]: WorkerFunction;
} = {} as any;

PROXY_EVENT_LISTENERS.forEach((key) => {
	proxyEventHandlers[key] = appModule[key]?.bind?.(appModule);
});

expose({
	...proxyEventHandlers,
	...proxyObservables,
	init: () => {},
	dispose: appModule.dispose.bind(appModule),
	isInitialized: appModule.isInitialized.bind(appModule),
	lifecycle$: appModule.lifecycle$.bind(appModule)
} satisfies ExposedAppModule);

export type ExposedAppModule = ExposedWorkerThreadModule<Methods<AppModule>>;
