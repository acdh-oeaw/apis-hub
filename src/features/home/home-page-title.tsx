import type { ReactNode } from "react";

interface HomePageTitleProps {
	children: ReactNode;
}

export function HomePageTitle(props: HomePageTitleProps): JSX.Element {
	const { children } = props;

	return <h1 className="text-[2.2rem]">{children}</h1>;
}
