import type { ApisEntityType } from "@/features/apis/types";

export interface ApisLabeledEntitytype {
	id: ApisEntityType;
	label: string;
}

export const entityTypes: Record<ApisEntityType, ApisLabeledEntitytype> = {
	Event: { id: "Event", label: "Event" },
	Institution: { id: "Institution", label: "Institution" },
	Person: { id: "Person", label: "Person" },
	Place: { id: "Place", label: "Place" },
	Work: { id: "Work", label: "Work" },
};
