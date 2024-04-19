import type { ReactNode } from "react";

interface NetworksPageContainerProps {
	children: ReactNode;
}

export function NetworksPageContainer(props: NetworksPageContainerProps): JSX.Element {
	const { children } = props;

	return <main className="relative grid grid-rows-[auto_1fr]">{children}</main>;
}
