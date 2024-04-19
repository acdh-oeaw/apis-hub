import { HttpError } from "@stefanprobst/request";
import type { FormEvent } from "react";

import { getApisErrorMessage, useSignInWithBasicAuth } from "@/features/apis/api";
import { toast } from "@/features/toast/toast";
import { Button } from "@/features/ui/button";
import { TextField } from "@/features/ui/textfield";
import type { ApisInstanceConfig, UserAuth } from "~/config/apis.config";

interface SignInFormProps {
	instance: ApisInstanceConfig;
	signIn: (instance: ApisInstanceConfig, userAuth: UserAuth) => void;
}

export function SignInForm(props: SignInFormProps): JSX.Element {
	const { instance, signIn } = props;

	const signInMutation = useSignInWithBasicAuth(instance);

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		const formData = new FormData(event.currentTarget);

		const username = formData.get("username") as string;
		const password = formData.get("password") as string;

		signInMutation.mutate(
			{ username, password },
			{
				async onError(error) {
					if (error instanceof HttpError) {
						const message = await getApisErrorMessage(error);
						toast.error(message);
					} else {
						toast.error(String(error));
					}
				},
				onSuccess() {
					signIn(instance, { username, password });
					toast.info("Signed in " + username);
				},
			},
		);

		event.preventDefault();
	}

	return (
		<form className="grid gap-4" onSubmit={onSubmit}>
			<TextField label="Username" name="username" required />
			<TextField label="Password" name="password" required type="password" />
			<Button isDisabled={signInMutation.isLoading} type="submit">
				Sign in
			</Button>
		</form>
	);
}
