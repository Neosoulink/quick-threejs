import { serializeObject3D } from "@quick-threejs/utils";
import { filter, map, Observable, share, Subject } from "rxjs";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationClipJSON } from "three";
import { inject, singleton } from "tsyringe";

import {
	LoadedResourcePayload,
	SerializedLoadedResourcePayload
} from "../../../common/interfaces/loader.interface";
import { LoaderService } from "./loader.service";
import { JsonSerializable } from "threads";

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

					const scenes = _resource.scenes.map((scene) =>
						serializeObject3D(scene)
					);

					resource = {
						animations: (payload?.resource as GLTF).animations.map(
							// @ts-ignore <<toJSON methods doesn't require a parameter>>
							(animation) => animation.toJSON() as AnimationClipJSON
						) as unknown as JsonSerializable,
						cameras: _resource.cameras.map((camera) =>
							serializeObject3D(camera)
						),
						parser: { json: _resource.parser.json },
						scene: scenes?.[0],
						scenes,
						userData: _resource.userData
					};
				}

				if (
					payload?.source?.type === "video" &&
					Array.isArray(payload.resource)
				) {
					console.log("Serialized Texture ===>", payload.resource);
				}

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
