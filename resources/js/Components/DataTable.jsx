import React, { useMemo } from "react";
import {
    ChevronUpDownIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from "@heroicons/react/24/solid";

export default React.memo(function DataTable({
    columns,
    data,
    sortField,
    sortDir,
    onSort,
    renderRow,
    itemsPerPage = 10, // default pagination
    enablePagination = true, // toggle pagination
}) {
    const [page, setPage] = React.useState(1);

    // Derived values (only recompute when data or pagination changes)
    const paginatedData = useMemo(() => {
        if (!enablePagination) return data;
        const start = (page - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, page, itemsPerPage, enablePagination]);

    const totalPages = useMemo(
        () => Math.ceil(data.length / itemsPerPage),
        [data.length, itemsPerPage]
    );

    const SortIcon = ({ field }) => {
        if (sortField !== field)
            return <ChevronUpDownIcon className="w-4 h-4 inline ml-1" />;
        return sortDir === "asc" ? (
            <ArrowUpIcon className="w-4 h-4 inline ml-1" />
        ) : (
            <ArrowDownIcon className="w-4 h-4 inline ml-1" />
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm table-fixed">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.field || col.label}
                                className={`px-4 py-3 font-medium text-gray-500 uppercase tracking-wider ${
                                    col.sortable
                                        ? "cursor-pointer select-none"
                                        : ""
                                } ${
                                    col.label === "Actions"
                                        ? "text-center"
                                        : "text-left"
                                }`}
                                onClick={() =>
                                    col.sortable && onSort(col.field)
                                }
                            >
                                {col.label}{" "}
                                {col.sortable && <SortIcon field={col.field} />}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-4 text-center text-gray-500"
                            >
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map(renderRow)
                    )}
                </tbody>
            </table>

            {enablePagination && totalPages > 1 && (
                <div className="flex justify-end items-center gap-2 p-4 border-t border-gray-100">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() =>
                            setPage((p) => Math.min(p + 1, totalPages))
                        }
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
});
