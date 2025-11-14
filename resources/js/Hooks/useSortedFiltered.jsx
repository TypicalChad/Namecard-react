import { useMemo } from "react";

export function useSortedFiltered(
    items,
    searchTerm = "",
    searchFields = [],
    sortField = null,
    sortDir = "asc"
) {
    const filtered = useMemo(() => {
        return items.filter((item) =>
            searchFields.some((field) =>
                (item[field] || "")
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    }, [items, searchTerm, searchFields]);

    const sorted = useMemo(() => {
        if (!sortField) return filtered;
        return [...filtered].sort((a, b) => {
            let aVal = (a[sortField] || "").toString().toLowerCase();
            let bVal = (b[sortField] || "").toString().toLowerCase();
            if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
    }, [filtered, sortField, sortDir]);

    return sorted;
}
