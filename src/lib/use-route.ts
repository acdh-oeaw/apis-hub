import { createUrl } from "@acdh-oeaw/lib";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { baseUrl } from "~/config/app.config";

export function useRoute(): URL {
	const router = useRouter();

	const url = useMemo(() => {
		return createUrl({ baseUrl, pathname: router.asPath });
	}, [router]);

	return url;
}
