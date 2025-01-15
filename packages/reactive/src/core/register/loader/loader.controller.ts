import {
	copyProperties,
	excludeProperties,
	serializeObject3D
} from "@quick-threejs/utils";
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
					payload?.source?.type === "audio" &&
					payload.resource instanceof AudioBuffer
				)
					resource = {
						arrayBuffer: payload.resource.getChannelData(0),
						length: payload.resource.length,
						sampleRate: payload.resource.sampleRate,
						duration: payload.resource.duration
					};

				if (
					payload?.source?.type === "video" &&
					payload.resource instanceof HTMLVideoElement
				)
					resource = {
						...copyProperties(payload.resource, [
							"autoplay",
							"baseURI",
							"controls",
							"crossOrigin",
							"currentTime",
							"defaultMuted",
							"disablePictureInPicture",
							"draggable",
							"duration",
							"ended",
							"height",
							"hidden",
							"loop",
							"muted",
							"nodeName",
							"nodeType",
							"paused",
							"playbackRate",
							"playsInline",
							"poster",
							"preload",
							"readyState",
							"seeking",
							"spellcheck",
							"src",
							"tabIndex",
							"translate",
							"videoHeight",
							"videoWidth",
							"volume",
							"width"
						]),
						buffered: payload.resource.buffered.length,
						error: payload.resource.error
							? excludeProperties(payload.resource.error, [])
							: {},
						played: payload.resource.played.length,
						seekable: payload.resource.seekable.length,
						textTracks: payload.resource.textTracks.length
					};

				return {
					...payload,
					resource
				};
			}),
			share()
		);

	public readonly loadCompleted$: Observable<
		Pick<LoaderService, "loadedCount" | "loadedResources" | "toLoadCount">
	> = this.load$.pipe(
		filter((payload) => payload.toLoadCount === payload.loadedCount),
		map(() =>
			copyProperties(this._service, [
				"loadedCount",
				"loadedResources",
				"toLoadCount"
			])
		),
		share()
	);

	constructor(
		@inject(LoaderService) private readonly _service: LoaderService
	) {}
}
