import { request } from "@stefanprobst/request";
import type { GetStaticPropsResult } from "next";

import { PageContent } from "@/app/page-content";
import { Imprint } from "@/features/imprint/imprint";
import { url as imprintUrl } from "~/config/imprint.config";

interface ImprintPageProps {
	imprint: string;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<ImprintPageProps>> {
	const imprint: string = await request(imprintUrl, { responseType: "text" });

	return { props: { imprint } };
}

export default function ImprintPage(props: ImprintPageProps): JSX.Element {
	const { imprint } = props;

	return (
		<PageContent>
			<Imprint imprint={imprint} />
		</PageContent>
	);
}
