import { useState } from "react";

import type { useGetApisRelations } from "@/features/apis/api";

export type SearchFilters = Parameters<typeof useGetApisRelations>[1];

interface UseSearchFiltersResult {
	searchFilters: SearchFilters | null;
	setSearchFilters: (searchFilters: SearchFilters) => void;
}

export function useSearchFilters(
	initialsSearchFilters: SearchFilters | null = null,
): UseSearchFiltersResult {
	const [searchFilters, _setSearchFilters] = useState<SearchFilters | null>(initialsSearchFilters);

	function setSearchFilters(searchFilters: SearchFilters) {
		_setSearchFilters(
			searchFilters == null ? searchFilters : removeEmptyStringValues(searchFilters),
		);
	}

	return { searchFilters, setSearchFilters };
}

function removeEmptyStringValues<T extends object>(values: T): T {
	const result = {} as T;

	Object.entries(values).forEach(([key, value]) => {
		if (value == null || (typeof value === "string" && value.length === 0)) return;

		result[key as keyof T] = value;
	});

	return result;
}
