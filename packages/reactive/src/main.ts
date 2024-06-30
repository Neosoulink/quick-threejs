import "reflect-metadata";

import { register } from "./modules/register/register.module";

if (process.env.NODE_ENV === "development") {
	const app = register({
		location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
		enableDebug: true,
		axesSizes: 5,
		gridSizes: 10,
		withMiniCamera: true
	});

	app.lifecycle$().subscribe(() => {
		app
			.gui()
			?.add({ props: 0 }, "props")
			.onChange((value) => {
				app.core().worker?.postMessage({ type: "gui-event", value });
			});
	});
}
