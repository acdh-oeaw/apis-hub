import Link from "next/link";

import styles from "@/app/page-footer.module.css";

export function PageFooter(): JSX.Element {
	return (
		<footer className={styles["container"]}>
			<small className={styles["copyright"]}>
				<span>&copy; {new Date().getUTCFullYear()}</span>
				<a href="https://www.oeaw.ac.at/acdh" rel="noreferrer" target="_blank">
					ACDH-CH
				</a>
			</small>
			<Link href={{ pathname: "/imprint" }}>Imprint</Link>
		</footer>
	);
}
