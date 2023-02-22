import { createUrl } from "@stefanprobst/request";

import { env } from "~/config/env.config";

export const url = createUrl({
	baseUrl: "https://shared.acdh.oeaw.ac.at",
	pathname: "/acdh-common-assets/api/imprint.php",
	searchParams: { outputLang: "en", serviceID: env.NEXT_PUBLIC_REDMINE_ID },
});
