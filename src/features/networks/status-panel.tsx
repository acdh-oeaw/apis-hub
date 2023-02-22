import { useEffect } from "react";

import { Panel } from "@/features/networks/panel";
import { useVisualisation } from "@/features/networks/visualisation";
import { useForceRender } from "@/lib/use-force-render";
import type { ApisInstanceConfig } from "~/config/apis.config";

interface StatusPanelProps {
	instance: ApisInstanceConfig;
}

export function StatusPanel(props: StatusPanelProps): JSX.Element {
	const { instance } = props;

	const { renderer } = useVisualisation();
	const forceRender = useForceRender();

	const graph = renderer?.getGraph();
	const edgeCont = graph == null ? 0 : graph.size;
	const nodeCount = graph == null ? 0 : graph.order;

	useEffect(() => {
		const graph = renderer?.getGraph();
		if (graph == null) return;

		graph.on("edgeAdded", forceRender);
		graph.on("cleared", forceRender);

		return () => {
			graph.off("edgeAdded", forceRender);
			graph.off("cleared", forceRender);
		};
	}, [renderer, forceRender]);

	return (
		<Panel>
			<dl className="flex w-full justify-end gap-4 py-0.5 font-medium">
				<div>
					<dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Edges</dt>
					<dd>{edgeCont}</dd>
				</div>
				<div>
					<dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Nodes</dt>
					<dd>{nodeCount}</dd>
				</div>
				<div>
					<dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
						APIS Instance
					</dt>
					<dd>{instance.title}</dd>
				</div>
				{instance.access.type === "restricted" ? (
					<div>
						<dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
							Signed in as
						</dt>
						<dd>{instance.access.user?.username}</dd>
					</div>
				) : null}
			</dl>
		</Panel>
	);
}
