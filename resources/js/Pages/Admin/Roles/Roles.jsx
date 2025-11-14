import AdminLayout from "../../../Layouts/AdminLayout";
import { router, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import TableFilter from "@/Components/TableFilter";
import DataTable from "@/Components/DataTable";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import { useSortedFiltered } from "@/Hooks/useSortedFiltered";

export default function Roles({ roles, breadcrumbs }) {
    const { props } = usePage();
    const auth = props?.auth;
    const { roleName, permissions } = useAuthPermissions("Roles");

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");

    // Filtering & sorting by role name
    const sortedRoles = useSortedFiltered(
        roles,
        searchTerm,
        ["name", "id", "created_at"],
        sortField,
        sortDir
    );

    const handleSort = (field) =>
        setSortField(field === sortField ? field : field) ||
        setSortDir(
            sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc"
        );

    const deleteRole = (id) =>
        permissions.delete &&
        confirm("Delete this role?") &&
        router.post(roleUrl(roleName, "roles.destroy", id), {
            _method: "DELETE",
        });

    const columns = [
        { label: "Name", field: "name", sortable: true },
        { label: "Display Name", field: "display name", sortable: true },
        { label: "Actions" },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Roles
                    </h2>
                    {permissions.create && (
                        <button
                            onClick={() =>
                                router.get(roleUrl(roleName, "roles.create"))
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
                    data={sortedRoles}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                    renderRow={(r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">{r.name}</td>
                            <td className="px-4 py-4">{r.display_name}</td>
                            <td className="px-4 py-4 flex gap-2">
                                {permissions.edit && (
                                    <Link
                                        href={roleUrl(
                                            roleName,
                                            "roles.edit",
                                            r.id
                                        )}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {permissions.delete && (
                                    <button
                                        onClick={() => deleteRole(r.id)}
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
                />
            </div>
        </AdminLayout>
    );
}
