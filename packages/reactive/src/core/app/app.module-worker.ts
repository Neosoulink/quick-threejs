import { ExposedWorkerThreadModule, Methods } from "@quick-threejs/utils";
import { container as parentContainer } from "tsyringe";
import { expose } from "threads/worker";
import type { WorkerFunction } from "threads/dist/types/worker";

import type { ProxyEventListenerKeys } from "../../common/types";
import { AppLifecycleState } from "../../common/enums";
import { PROXY_EVENT_LISTENERS } from "../../common/constants";
import { LaunchAppProps } from "../../common/models";
import { AppModule } from "./app.module";

/** @internal */
const container = parentContainer.createChildContainer();
/** @internal */
const module = container.resolve(AppModule);

export const launchApp = (props?: LaunchAppProps<AppModule>) => {
	module.lifecycle$().subscribe((state) => {
		if (state === AppLifecycleState.INITIALIZED && props?.onReady) {
			props.onReady({ container, module });
		}
	});

	return { container, module };
};

const proxyEventHandlers: {
	[key in (typeof PROXY_EVENT_LISTENERS)[number]]: WorkerFunction;
} = {} as typeof proxyEventHandlers;
const proxyObservables: {
	[key in `${ProxyEventListenerKeys}$`]: WorkerFunction;
} = {} as typeof proxyObservables;

PROXY_EVENT_LISTENERS.forEach((key) => {
	proxyEventHandlers[key] = module[key]?.bind?.(module);
});

expose({
	...proxyEventHandlers,
	...proxyObservables,
	init: module.init.bind(module),
	dispose: module.dispose.bind(module),
	isInitialized: module.isInitialized.bind(module),
	lifecycle$: module.lifecycle$.bind(module)
} satisfies ExposedAppModule);

export type ExposedAppModule = ExposedWorkerThreadModule<Methods<AppModule>>;
