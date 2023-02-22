import type { ReactNode } from "react";

import styles from "@/features/home/home-page-title.module.css";

interface HomePageTitleProps {
	children: ReactNode;
}

export function HomePageTitle(props: HomePageTitleProps): JSX.Element {
	const { children } = props;

	return <h1 className={styles["heading"]}>{children}</h1>;
}
