import AdminLayout from "../../../Layouts/AdminLayout";
import { router, Link, usePage } from "@inertiajs/react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { roleUrl } from "@/Utils/roleUrl";
import TableFilter from "@/Components/TableFilter";
import DataTable from "@/Components/DataTable";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import { useSortedFiltered } from "@/Hooks/useSortedFiltered";

// Debounce helper to limit re-filtering during typing
function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

export default function Namecards({ namecards, breadcrumbs }) {
    const { props } = usePage();
    const { roleName, permissions } = useAuthPermissions("Namecards");

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");

    // ✅ Debounce searchTerm to prevent re-filtering on every keystroke
    const debouncedSearch = useDebounce(searchTerm, 300);

    // ✅ Stable column definitions (so DataTable doesn’t re-render unnecessarily)
    const columns = useMemo(
        () => [
            { label: "Full Name", field: "name", sortable: true },
            { label: "Email", field: "email", sortable: true },
            { label: "Position", field: "position", sortable: true },
            { label: "Company", field: "company.name", sortable: true },
            { label: "UID", field: "uid", sortable: true },
            { label: "Category", field: "department", sortable: true },
            { label: "Actions" },
        ],
        []
    );

    // ✅ Stable sorting handler
    const handleSort = useCallback(
        (field) => {
            if (field === sortField) {
                setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
            } else {
                setSortField(field);
                setSortDir("asc");
            }
        },
        [sortField]
    );

    // ✅ Stable delete function
    const deleteNamecard = useCallback(
        (id) =>
            permissions.delete &&
            confirm("Are you sure you want to delete this namecard?") &&
            router.post(roleUrl(roleName, "namecards.destroy", id), {
                _method: "DELETE",
            }),
        [permissions.delete, roleName]
    );

    // ✅ Filter + sort hook (uses debounced search term)
    const sortedNamecards = useSortedFiltered(
        namecards,
        debouncedSearch,
        [
            "name",
            "position",
            "email",
            "uid",
            "company.name",
            "department.acronym",
        ],
        sortField,
        sortDir
    );

    // ✅ Stable renderRow function
    const renderRow = useCallback(
        (nc) => {
            const imageUrl = nc.image ? `/storage/${nc.image}` : null;

            return (
                <tr key={nc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">{nc.name}</td>
                    <td className="px-4 py-4">{nc.email ?? "-"}</td>
                    <td className="px-4 py-4">{nc.position ?? "-"}</td>
                    <td className="px-4 py-4 w-56 max-w-[14rem] whitespace-normal break-words text-gray-800">
                        {nc.company?.name ?? "-"}
                    </td>
                    <td className="px-4 py-4 w-48 max-w-[12rem] whitespace-normal break-words text-gray-800">
                        {nc.uid ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                        {nc.department?.acronym ?? "-"}
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                        {permissions.edit && (
                            <Link
                                href={roleUrl(roleName, "namecards.edit", {
                                    id: nc.id,
                                })}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Edit
                            </Link>
                        )}
                        <a
                            href={`/profile/${nc.uid}`}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            aria-label={`View namecard ${nc.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View
                        </a>
                        {permissions.delete && (
                            <button
                                onClick={() => deleteNamecard(nc.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        )}
                        {!permissions.edit && !permissions.delete && "-"}
                    </td>
                </tr>
            );
        },
        [permissions, deleteNamecard, roleName]
    );

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Namecards
                    </h2>
                    {permissions.create && (
                        <button
                            onClick={() =>
                                router.get(
                                    roleUrl(roleName, "namecards.create")
                                )
                            }
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Add New
                        </button>
                    )}
                </div>

                {/* Filter/Search */}
                <TableFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={sortedNamecards}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                    renderRow={renderRow}
                    enablePagination={true}
                    itemsPerPage={10}
                />
            </div>
        </AdminLayout>
    );
}
