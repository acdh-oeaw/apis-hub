import cx from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Spinner } from "@/features/ui/spinner";

interface ButtonProps extends Pick<ComponentPropsWithoutRef<"button">, "onClick"> {
	children: ReactNode;
	isDisabled?: boolean;
	isLoading?: boolean;
	/** @default 'button' */
	type?: "button" | "reset" | "submit";
}

export function Button(props: ButtonProps): JSX.Element {
	const { children, isDisabled = false, isLoading = false, onClick, type = "button" } = props;

	return (
		<button
			aria-disabled={isDisabled}
			className={cx(
				"inline-flex items-center justify-center gap-2 rounded px-4 py-3 text-sm font-semibold leading-none transition-colors focus:outline-none focus:ring-1",
				isDisabled
					? "pointer-events-none bg-gray-100 text-gray-500 focus:ring-gray-600"
					: "bg-primary text-white hover:bg-primary-dark focus:ring-primary-light",
			)}
			onClick={onClick}
			type={type}
		>
			{isLoading ? <Spinner /> : null}
			{children}
		</button>
	);
}
