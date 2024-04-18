import { assert } from "@stefanprobst/assert";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_APP_BASE_URL?: string;
			NEXT_PUBLIC_BOTS?: string;
			NEXT_PUBLIC_MATOMO_BASE_URL?: string;
			NEXT_PUBLIC_MATOMO_ID?: string;
			NEXT_PUBLIC_REDMINE_ID?: string;
		}
	}
}

interface Env {
	NEXT_PUBLIC_APP_BASE_URL: string;
	NEXT_PUBLIC_BOTS?: "disabled" | "enabled";
	NEXT_PUBLIC_MATOMO_BASE_URL?: string;
	NEXT_PUBLIC_MATOMO_ID?: string;
	NEXT_PUBLIC_REDMINE_ID: string;
}

assert(process.env.NEXT_PUBLIC_APP_BASE_URL != null);
if (process.env.NEXT_PUBLIC_BOTS != null) {
	assert(process.env.NEXT_PUBLIC_BOTS === "enabled" || process.env.NEXT_PUBLIC_BOTS === "disabled");
}
assert(process.env.NEXT_PUBLIC_REDMINE_ID != null);

export const env: Env = {
	NEXT_PUBLIC_APP_BASE_URL: process.env["NEXT_PUBLIC_APP_BASE_URL"],
	NEXT_PUBLIC_BOTS: process.env["NEXT_PUBLIC_BOTS"],
	NEXT_PUBLIC_MATOMO_BASE_URL: process.env["NEXT_PUBLIC_MATOMO_BASE_URL"],
	NEXT_PUBLIC_MATOMO_ID: process.env["NEXT_PUBLIC_MATOMO_ID"],
	NEXT_PUBLIC_REDMINE_ID: process.env["NEXT_PUBLIC_REDMINE_ID"],
};
