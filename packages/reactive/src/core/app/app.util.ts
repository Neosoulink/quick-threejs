import { ExposedWorkerThreadModule, Methods } from "@quick-threejs/utils";
import { container as parentContainer } from "tsyringe";
import { expose } from "threads/worker";
import type { WorkerFunction } from "threads/dist/types/worker";

import {
	type ProxyEventListenerKeys,
	type ContainerizedApp,
	PROXY_EVENT_LISTENERS,
	CONTAINER_TOKEN,
	AppModulePropsMessageEvent
} from "../../common";
import { LaunchAppProps } from "../../common/blueprints";
import { AppModule } from "./app.module";

export const launchApp = (props?: LaunchAppProps<AppModule>) => {
	const container = parentContainer.createChildContainer();
	const module = container.resolve(AppModule);
	const app: ContainerizedApp<AppModule> = { container, module };
	const proxyEventHandlers: {
		[key in ProxyEventListenerKeys]: WorkerFunction;
	} = {} as typeof proxyEventHandlers;
	const handleInitMessage = (event: AppModulePropsMessageEvent) => {
		if (!event.data?.canvas || module.getIsInitialized()) return;

		const startTimer = !!event.data?.startTimer;
		const withMiniCamera = !!event.data?.withMiniCamera;
		const fullScreen = !!event.data?.fullScreen;

		module.init({
			...event.data,
			startTimer,
			withMiniCamera,
			fullScreen
		});

		props?.onReady?.(app);

		self?.removeEventListener("message", handleInitMessage);
	};

	container.register(CONTAINER_TOKEN, { useValue: container });
	PROXY_EVENT_LISTENERS.forEach((key) => {
		proxyEventHandlers[key] = module[key]?.bind?.(module);
	});
	self?.addEventListener("message", handleInitMessage);

	expose({
		...proxyEventHandlers,
		getProxyReceiver: module.getProxyReceiver.bind(module),
		getIsInitialized: module.getIsInitialized.bind(module),
		getBeforeStep$: module.getBeforeStep$.bind(module),
		getBeforeRender$: module.getBeforeRender$.bind(module),
		getStep$: module.getStep$.bind(module),
		getAfterRender$: module.getAfterRender$.bind(module),
		dispose: module.dispose.bind(module)
	} satisfies ExposedAppModule);

	return app;
};

export type ExposedAppModule = Omit<
	ExposedWorkerThreadModule<Methods<AppModule>>,
	`${ProxyEventListenerKeys}$` | "init" | "getCanvas"
>;
