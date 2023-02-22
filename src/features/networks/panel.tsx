import type { ReactNode } from "react";

interface PanelProps {
	children: ReactNode;
}

export function Panel(props: PanelProps): JSX.Element {
	const { children } = props;

	return (
		<aside className="flex max-h-72 gap-2 overflow-y-auto overflow-x-hidden rounded border-2 border-transparent bg-white px-4 py-2 text-sm text-gray-500 shadow-md focus-within:border-2 focus-within:border-primary">
			{children}
		</aside>
	);
}
