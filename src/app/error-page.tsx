import styles from "@/app/error-page.module.css";

export function ErrorPage(): JSX.Element {
	return (
		<main className={styles["container"]}>
			<div role="alert">
				<p>😢 Something went horribly wrong.</p>
			</div>
		</main>
	);
}
