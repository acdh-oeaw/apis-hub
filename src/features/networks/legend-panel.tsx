import { Panel } from "@/features/networks/panel";
import { colors } from "~/config/visualisation.config";

export function LegendPanel(): JSX.Element {
	return (
		<Panel>
			<div className="flex w-full gap-4 py-0.5 font-medium">
				{Object.entries(colors.node).map(([label, color]) => {
					return (
						<div key={label} className="flex items-center gap-2">
							<div className="h-3 w-3 rounded" style={{ backgroundColor: color }} /> {label}
						</div>
					);
				})}
			</div>
		</Panel>
	);
}
