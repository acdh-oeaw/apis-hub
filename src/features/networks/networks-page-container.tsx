import type { ReactNode } from "react";

import styles from "@/features/networks/networks-page-container.module.css";

interface NetworksPageContainerProps {
	children: ReactNode;
}

export function NetworksPageContainer(props: NetworksPageContainerProps): JSX.Element {
	const { children } = props;

	return <main className={styles["container"]}>{children}</main>;
}
