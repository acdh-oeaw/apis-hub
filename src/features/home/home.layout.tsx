import type { ReactNode } from "react";

interface HomeLayoutProps {
	children: ReactNode;
}

export function HomeLayout(props: HomeLayoutProps): JSX.Element {
	const { children } = props;

	return <div className="grid gap-8">{children}</div>;
}
