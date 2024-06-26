import type { ReactNode } from "react";

import { PageFooter } from "@/app/page-footer";
import { PageHeader } from "@/app/page-header";

interface PageLayoutProps {
	children: ReactNode;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
	const { children } = props;

	return (
		<div className="grid min-h-full grid-rows-[auto_1fr_auto]">
			<PageHeader />
			{children}
			<PageFooter />
		</div>
	);
}
