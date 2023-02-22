import { SignInForm } from "@/features/networks/sign-in-form";
import styles from "@/features/networks/sign-in-page.module.css";
import type { ApisInstanceConfig, UserAuth } from "~/config/apis.config";

interface SignInPageProps {
	instance: ApisInstanceConfig;
	signIn: (instance: ApisInstanceConfig, userAuth: UserAuth) => void;
}

export function SignInPage(props: SignInPageProps): JSX.Element {
	const { instance, signIn } = props;

	return (
		<main className={styles["container"]}>
			<h2>Sign in to {instance.title}</h2>
			<SignInForm instance={instance} signIn={signIn} />
		</main>
	);
}
