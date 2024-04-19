import Link from "next/link";

export function PageFooter(): JSX.Element {
	return (
		<footer className="flex items-center justify-between p-4 text-sm">
			<small className="inline-flex gap-2 text-sm">
				<span>&copy; {new Date().getUTCFullYear()}</span>
				<a href="https://www.oeaw.ac.at/acdh" rel="noreferrer" target="_blank">
					ACDH-CH
				</a>
			</small>
			<Link href={{ pathname: "/imprint" }}>Imprint</Link>
		</footer>
	);
}
