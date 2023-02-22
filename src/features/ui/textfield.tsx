import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Label } from "@/features/ui/label";

interface TextFieldProps extends Pick<ComponentPropsWithoutRef<"input">, "required" | "type"> {
	label: ReactNode;
	name: string;
	placeholder?: string;
}

export function TextField(props: TextFieldProps): JSX.Element {
	const { label, name, placeholder, required, type } = props;

	return (
		<label>
			<Label as="span">{label}</Label>
			<input
				autoComplete="off"
				className="mt-1 w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
				name={name}
				placeholder={placeholder}
				required={required}
				type={type}
			/>
		</label>
	);
}
