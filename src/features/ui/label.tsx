import type { ElementType, ReactNode } from "react";

interface LabelProps {
	as?: ElementType;
	children: ReactNode;
}

export function Label(props: LabelProps): JSX.Element {
	const { as: LabelElement = "label", children } = props;

	return (
		<LabelElement className="block text-xs font-medium text-gray-700">{children}</LabelElement>
	);
}
