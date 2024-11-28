import { expose } from "threads/worker";
import { ExposedWorkerThreadModule } from "@quick-threejs/utils";

import { loaderModule, LoaderModule } from "./loader.module";

export type ExposedLoaderModule = ExposedWorkerThreadModule<LoaderModule>;

expose({
	lifecycle$: loaderModule.lifecycle$.bind(loaderModule),
	progress$: loaderModule.progress$.bind(loaderModule),
	progressCompleted$: loaderModule.progressCompleted$.bind(loaderModule),
	setDracoLoader: loaderModule.setDracoLoader.bind(loaderModule),
	load: loaderModule.load.bind(loaderModule),
	dispose: loaderModule.dispose.bind(loaderModule),
	items: loaderModule.items.bind(loaderModule),
	loaders: loaderModule.loaders.bind(loaderModule),
	toLoad: loaderModule.toLoad.bind(loaderModule),
	loaded: loaderModule.loaded.bind(loaderModule),
	resources: loaderModule.resources.bind(loaderModule),
	init: () => {}
} satisfies ExposedLoaderModule);
