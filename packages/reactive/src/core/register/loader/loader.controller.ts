import { serializeObject3D } from "@quick-threejs/utils";
import { filter, map, Observable, share, Subject } from "rxjs";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VideoTexture } from "three";
import { inject, singleton } from "tsyringe";

import {
	LoadedResourcePayload,
	SerializedLoadedResourcePayload
} from "../../../common/interfaces/loader.interface";
import { LoaderService } from "./loader.service";

@singleton()
export class LoaderController {
	public readonly load$$ = new Subject<
		Pick<LoadedResourcePayload, "resource" | "source">
	>();

	public readonly load$: Observable<LoadedResourcePayload> = this.load$$.pipe(
		map((payload) => ({
			...payload,
			loadedCount: payload.resource
				? this._service.loadedCount + 1
				: this._service.loadedCount,
			toLoadCount: this._service.toLoadCount
		})),
		share()
	);

	public readonly serializedLoad$: Observable<SerializedLoadedResourcePayload> =
		this.load$.pipe(
			map((payload) => {
				let resource =
					payload.resource as SerializedLoadedResourcePayload["resource"];

				if ((payload?.resource as GLTF)?.parser) {
					const _resource = payload.resource as GLTF;

					resource = {
						userData: _resource.userData,
						scene: serializeObject3D(_resource.scene)
					};
				}

				if (payload?.resource instanceof VideoTexture)
					resource = payload.resource.toJSON() as unknown as typeof resource;

				return {
					...payload,
					resource
				};
			})
		);
	public readonly loadCompleted$: Observable<LoadedResourcePayload> =
		this.load$.pipe(
			filter((payload) => payload.toLoadCount === payload.loadedCount)
		);

	constructor(
		@inject(LoaderService) private readonly _service: LoaderService
	) {}
}
