import { deserializeObject3D } from "@quick-threejs/utils";
import { filter, fromEvent, map, share } from "rxjs";
import { Lifecycle, scoped } from "tsyringe";

import {
	type SerializedLoadedResourcePayload,
	LoadedResourcePayload,
	LOADER_SERIALIZED_LOAD_TOKEN
} from "../../../common";

@scoped(Lifecycle.ResolutionScoped)
export class LoaderController {
	public readonly load$ = fromEvent<
		MessageEvent<
			| {
					token: string;
					payload: SerializedLoadedResourcePayload;
			  }
			| undefined
		>
	>(self, "message").pipe(
		filter(
			(event) =>
				event.data?.token === LOADER_SERIALIZED_LOAD_TOKEN &&
				!!event.data?.payload?.resource
		),
		map((event) => {
			const { payload } = event.data || {};

			if (!!payload?.resource && payload.source.type === "gltfModel") {
				const resource = payload.resource as any;
				const scene = deserializeObject3D(resource?.scene as string);

				return {
					...payload,
					resource: { ...resource, scene }
				} as LoadedResourcePayload;
			}

			return payload as LoadedResourcePayload;
		}),
		share()
	);
	public readonly loadCompleted$ = this.load$.pipe(
		filter((payload) => payload?.toLoadCount === payload.loadedCount)
	);
}
