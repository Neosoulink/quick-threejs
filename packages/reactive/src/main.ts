import "reflect-metadata";

import { register } from "./modules/register/register.module";
import { RegisterLifecycleState } from "./common/enums/lifecycle.enum";

if (process.env.NODE_ENV === "development") {
	const app = register({
		location: new URL("./main.worker.ts", import.meta.url) as unknown as string,
		enableDebug: true,
		axesSizes: 5,
		gridSizes: 10,
		withMiniCamera: true
	});

	app.lifecycle$().subscribe((state) => {
		if (state === RegisterLifecycleState.INITIALIZED)
			app
				.gui()
				?.add({ torusX: 0 }, "torusX")
				.step(0.01)
				.onChange((value) => {
					app.core().worker?.postMessage({ type: "torus-x-gui-event", value });
				});
	});
}
