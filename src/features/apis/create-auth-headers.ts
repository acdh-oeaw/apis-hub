import { assert } from "@stefanprobst/assert";

import { createBasicAuth } from "@/lib/create-basic-auth";
import type { ApisInstanceConfig } from "~/config/apis.config";

export function createAuthHeaders(instance: ApisInstanceConfig): { authorization?: string } {
	if (instance.access.type === "public") {
		return {};
	}

	assert(instance.access.user != null, "API requires authentication.");
	const { username, password } = instance.access.user;

	return { authorization: createBasicAuth(username, password) };
}
