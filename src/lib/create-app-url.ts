import type { UrlInit } from "@acdh-oeaw/lib";
import { createUrl } from "@acdh-oeaw/lib";

import { baseUrl } from "~/config/app.config";

type CreateAppUrlArgs = Omit<UrlInit, "baseUrl">;

export function createAppUrl(args: CreateAppUrlArgs): URL {
	return createUrl({ ...args, baseUrl });
}
