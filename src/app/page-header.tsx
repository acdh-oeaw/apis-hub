import Link from "next/link";

import { Logo } from "@/app/logo";

export function PageHeader(): JSX.Element {
	return (
		<header className="p-4">
			<Link aria-label="Home" href={{ pathname: "/" }}>
				<Logo />
			</Link>
		</header>
	);
}
