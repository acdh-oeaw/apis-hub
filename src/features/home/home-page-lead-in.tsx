import type { ReactNode } from "react";

interface HomePageLeadInProps {
	children: ReactNode;
}

export function HomePageLeadIn(props: HomePageLeadInProps): JSX.Element {
	const { children } = props;

	return (
		<p className="max-w-[80ch] text-lg text-gray-700 [&_a:hover]:no-underline [&_a]:underline [&_a]:decoration-dotted">
			{children}
		</p>
	);
}
