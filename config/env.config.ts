import { assert } from "@acdh-oeaw/lib";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			BOTS?: string;
			NEXT_PUBLIC_APP_BASE_URL?: string;
			NEXT_PUBLIC_MATOMO_BASE_URL?: string;
			NEXT_PUBLIC_MATOMO_ID?: string;
			NEXT_PUBLIC_REDMINE_ID?: string;
		}
	}
}

interface Env {
	BOTS?: "disabled" | "enabled";
	NEXT_PUBLIC_APP_BASE_URL: string;
	NEXT_PUBLIC_MATOMO_BASE_URL?: string;
	NEXT_PUBLIC_MATOMO_ID?: string;
	NEXT_PUBLIC_REDMINE_ID: string;
}

assert(process.env.NEXT_PUBLIC_APP_BASE_URL != null);
if (process.env.BOTS != null) {
	assert(process.env.BOTS === "enabled" || process.env.BOTS === "disabled");
}
assert(process.env.NEXT_PUBLIC_REDMINE_ID != null);

export const env: Env = {
	BOTS: process.env["BOTS"],
	NEXT_PUBLIC_APP_BASE_URL: process.env["NEXT_PUBLIC_APP_BASE_URL"],
	NEXT_PUBLIC_MATOMO_BASE_URL: process.env["NEXT_PUBLIC_MATOMO_BASE_URL"],
	NEXT_PUBLIC_MATOMO_ID: process.env["NEXT_PUBLIC_MATOMO_ID"],
	NEXT_PUBLIC_REDMINE_ID: process.env["NEXT_PUBLIC_REDMINE_ID"],
};
