import { useEffect, useState } from "react";
import type { ContainerizedApp, RegisterModule } from "@quick-threejs/reactive";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" }
	];
}

export default function Home() {
	const [app, setApp] = useState<
		ContainerizedApp<RegisterModule> | undefined
	>();

	useEffect(() => {
		import("@quick-threejs/reactive").then(({ register }) => {
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
						setApp(app);
					}
				});
		});

		return () => {
			app?.container.dispose();
		};
	}, []);

	return <div />;
}
