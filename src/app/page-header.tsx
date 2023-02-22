import Link from "next/link";

import { Logo } from "@/app/logo";
import styles from "@/app/page-header.module.css";

export function PageHeader(): JSX.Element {
	return (
		<header className={styles["container"]}>
			<Link aria-label="Home" href={{ pathname: "/" }}>
				<Logo />
			</Link>
		</header>
	);
}
