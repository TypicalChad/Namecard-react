import AdminLayout from "../../../Layouts/AdminLayout";
import { router, Link, usePage } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import DataTable from "@/Components/DataTable";

export default function Companies({ companies, breadcrumbs }) {
    const { props } = usePage();
    const auth = props?.auth;
    const { roleName, permissions } = useAuthPermissions("Companies");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");

    // Sorting and filtering
    const sortedCompanies = useMemo(() => {
        let filtered = companies;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((c) =>
                ["name", "website"].some((field) =>
                    String(c[field] || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            );
        }

        // Sort
        if (sortField) {
            filtered = [...filtered].sort((a, b) => {
                let aVal = a[sortField];
                let bVal = b[sortField];

                // Dates
                if (sortField === "created_at") {
                    aVal = new Date(aVal).getTime();
                    bVal = new Date(bVal).getTime();
                }

                // Numbers
                if (!isNaN(aVal) && !isNaN(bVal)) {
                    return sortDir === "asc" ? aVal - bVal : bVal - aVal;
                }

                // Strings
                return sortDir === "asc"
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });
        }

        return filtered;
    }, [companies, searchTerm, sortField, sortDir]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const deleteCompany = (id) =>
        permissions.delete &&
        confirm("Delete this company?") &&
        router.post(roleUrl(roleName, "companies.destroy", id), {
            _method: "DELETE",
        });

    const columns = [
        { label: "Company ID", field: "id", sortable: true },
        { label: "Name", field: "name", sortable: true },
        { label: "Actions" },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Companies
                    </h2>
                    {permissions.create && (
                        <button
                            onClick={() =>
                                router.get(
                                    roleUrl(roleName, "companies.create")
                                )
                            }
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Add New
                        </button>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Search:</span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={sortedCompanies}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                    renderRow={(c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-900">
                                {c.id}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                {c.name}
                            </td>

                            <td className="px-4 py-4 flex gap-2">
                                {permissions.edit && (
                                    <Link
                                        href={roleUrl(
                                            roleName,
                                            "companies.edit",
                                            c.id
                                        )}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {permissions.delete && (
                                    <button
                                        onClick={() => deleteCompany(c.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                )}
                                {!permissions.edit &&
                                    !permissions.delete &&
                                    "-"}
                            </td>
                        </tr>
                    )}
                    enablePagination={true}
                    itemsPerPage={10}
                />
            </div>
        </AdminLayout>
    );
}
