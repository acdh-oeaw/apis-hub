import { useApis } from "@/features/apis/apis.context";
import { ApisInstance } from "@/features/home/apis-instance";

export function ApisInstanceList(): JSX.Element {
	const { config } = useApis();
	const { instances } = config;

	return (
		<ul
			className="my-4 grid grid-cols-[repeat(auto-fill,minmax(min(384px,100%),1fr))] gap-12"
			role="list"
		>
			{Object.values(instances).map((instance, index) => {
				return (
					<li key={instance.id}>
						<ApisInstance index={index} instance={instance} />
					</li>
				);
			})}
		</ul>
	);
}
