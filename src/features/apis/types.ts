import type { IsoDateString, UrlString } from "@/lib/types";

export interface ApisRelation {
	id: number;
	url: UrlString;
	start_date: IsoDateString | null;
	end_date: IsoDateString | null;
	start_date_written: string | null;
	end_date_written: string | null;
	source: {
		id: number;
		url: UrlString;
		label: string;
		type: ApisEntityType;
	};
	target: {
		id: number;
		url: UrlString;
		label: string;
		type: ApisEntityType;
	};
	relation_type: {
		id: number;
		url: UrlString;
		label: string;
	};
}

export interface ApisRelationType {
	id: number;
	url: UrlString;
	name: string;
	name_reverse: string;
	description: string;
}

export interface ApisEntityBase {
	url: UrlString;
	id: number;
	name: string;
	entity_type: ApisEntityType;
	start_date: IsoDateString | null;
	end_date: IsoDateString | null;
	start_date_written: string | null;
	end_date_written: string | null;
}

export interface ApisEvent extends ApisEntityBase {
	type: "Event";
}

export interface ApisInstitution extends ApisEntityBase {
	type: "Institution";
}

export interface ApisPerson extends ApisEntityBase {
	type: "Person";
	gender: string;
	profession: Array<unknown>;
	title: Array<unknown>;
}

export interface ApisPlace extends ApisEntityBase {
	type: "Place";
	lat: number;
	lng: number;
}

export interface ApisWork extends ApisEntityBase {
	type: "Work";
}

export type ApisEntity = ApisEvent | ApisInstitution | ApisPerson | ApisPlace | ApisWork;

export type ApisEntityType = ApisEntity["type"];

// UPSTREAM: be aware that `relations` is not actually keyed by entity type, but by lowercased, pluralized keys
// UPSTREAM: note that entities have `name`+`entity_type`, whereas the relations endpoint returns `label`+`type` for `source` and `target`
export type ApisEntityDetails = ApisEntity & {
	relations: Record<ApisEntityType, Array<ApisRelation>>;
	kind?: { label: string };
	uris: Array<{ id: number; uri: UrlString }>;
};

export interface ApisEntitySuggestion {
	id: ApisEntity["id"];
	text: string;
}

export type PaginatedResponse<T> = {
	next: UrlString | null;
	previous: UrlString | null;
	count: number;
	limit: number;
	offset: number;
	results: Array<T>;
};
