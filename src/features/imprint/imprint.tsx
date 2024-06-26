interface ImprintProps {
	imprint: string;
}

export function Imprint(props: ImprintProps): JSX.Element {
	const { imprint } = props;

	return (
		<div className="prose">
			<h1>Imprint</h1>
			<div dangerouslySetInnerHTML={{ __html: imprint }} />
		</div>
	);
}
