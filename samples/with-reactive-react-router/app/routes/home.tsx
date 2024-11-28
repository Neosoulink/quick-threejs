import { useEffect, useState } from "react";
import { register, RegisterModule } from "@quick-threejs/reactive";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" }
	];
}

export default function Home() {
	const [app, setApp] = useState<RegisterModule | undefined>();

	useEffect(() => {
		if (!app && typeof window !== "undefined")
			register({
				location: new URL(
					"../core/main.worker.ts",
					import.meta.url
				) as unknown as string,
				enableDebug: true,
				axesSizes: 5,
				gridSizes: 10,
				withMiniCamera: true,
				onReady: (app) => {
					app
						.gui()
						?.add({ torusX: 0 }, "torusX")
						.step(0.01)
						.onChange((value: any) => {
							app.worker()?.postMessage({ type: "torus-x-gui-event", value });
						});

					setApp(app);
				}
			});
	}, []);

	return <div />;
}
