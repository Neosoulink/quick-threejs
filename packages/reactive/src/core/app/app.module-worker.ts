import { expose } from "threads/worker";
import { ExposedWorkerThreadModule, Methods } from "@quick-threejs/utils";
import type { WorkerFunction } from "threads/dist/types/worker";

import { AppModule, appModule } from "./app.module";
import { AppLifecycleState } from "../../common/enums/lifecycle.enum";
import { PROXY_EVENT_LISTENERS } from "../../common/constants/event.constants";
import { LaunchAppProps } from "../../common/models/launch-app-props.model";
import type { ProxyEventListenerKeys } from "../../common/types/object.type";

export const launchApp = (props?: LaunchAppProps) => {
	appModule.lifecycle$().subscribe((state) => {
		if (state === AppLifecycleState.INITIALIZED && props?.onReady) {
			props.onReady(appModule);
		}
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
	init: appModule.init.bind(appModule),
	dispose: appModule.dispose.bind(appModule),
	isInitialized: appModule.isInitialized.bind(appModule),
	lifecycle$: appModule.lifecycle$.bind(appModule)
} satisfies ExposedAppModule);

export type ExposedAppModule = ExposedWorkerThreadModule<Methods<AppModule>>;
