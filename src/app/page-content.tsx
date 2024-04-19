import type { ReactNode } from "react";

interface PageContentProps {
	children: ReactNode;
}

export function PageContent(props: PageContentProps): JSX.Element {
	const { children } = props;

	return <main className="p-8">{children}</main>;
}
