import { useMemo } from "react";

// Helper to safely get nested values like "company.name"
function getNestedValue(obj, key) {
    return key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "";
}

export function useSortedFiltered(
    items,
    searchTerm = "",
    searchFields = [],
    sortField = null,
    sortDir = "asc"
) {
    // 1️⃣ Filter
    const filtered = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return items.filter((item) =>
            searchFields.some((field) =>
                getNestedValue(item, field)
                    .toString()
                    .toLowerCase()
                    .includes(term)
            )
        );
    }, [items, searchTerm, searchFields]);

    // 2️⃣ Sort
    const sorted = useMemo(() => {
        if (!sortField) return filtered;

        return [...filtered].sort((a, b) => {
            const aVal = getNestedValue(a, sortField).toString().toLowerCase();
            const bVal = getNestedValue(b, sortField).toString().toLowerCase();

            if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
    }, [filtered, sortField, sortDir]);

    return sorted;
}
