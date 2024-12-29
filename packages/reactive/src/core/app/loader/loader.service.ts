import { Lifecycle, scoped } from "tsyringe";

import {
	LoadedResourcePayload,
	LoaderResource
} from "../../../common/interfaces";
import { LoaderService as RegisterLoaderService } from "../../register/loader/loader.service";

@scoped(Lifecycle.ResolutionScoped)
export class LoaderService
	implements
		Pick<
			RegisterLoaderService,
			"toLoadCount" | "loadedCount" | "loadedResources"
		>
{
	public loadedResources: Record<string, LoaderResource> = {};
	public toLoadCount = 0;
	public loadedCount = 0;

	public handleLoad(payload: LoadedResourcePayload) {
		const { source, resource, loadedCount, toLoadCount } = payload;

		if (!resource) return;

		this.loadedResources[source.name] = resource;

		this.toLoadCount = loadedCount;
		this.loadedCount = toLoadCount;
	}
}
