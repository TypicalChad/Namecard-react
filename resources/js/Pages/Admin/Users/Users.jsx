import AdminLayout from "../../../Layouts/AdminLayout";
import { router, Link, usePage } from "@inertiajs/react";
import TableFilter from "@/Components/TableFilter";
import DataTable from "@/Components/DataTable";
import { useState } from "react";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import { useSortedFiltered } from "@/Hooks/useSortedFiltered";

export default function Users({ users, breadcrumbs }) {
    const { props } = usePage();
    const auth = props?.auth;
    const { roleName, permissions } = useAuthPermissions("User");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");

    const sortedUsers = useSortedFiltered(
        users,
        searchTerm,
        ["name", "email", "role_name", "department_name"],
        sortField,
        sortDir
    );

    const handleSort = (field) =>
        setSortField(field) ||
        setSortDir(
            sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc"
        );

    const deleteUser = (id) =>
        permissions.delete &&
        confirm("Delete this user?") &&
        router.post(roleUrl(roleName, "users.destroy", id), {
            _method: "DELETE",
        });

    const columns = [
        { label: "ID", field: "id", sortable: true },
        { label: "Name", field: "name", sortable: true },
        { label: "Email", field: "email", sortable: true },
        { label: "Role", field: "role_name", sortable: true },
        { label: "Department", field: "department_name", sortable: true },
        { label: "Actions" },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Users
                    </h2>
                    {permissions.create && (
                        <button
                            onClick={() =>
                                router.get(roleUrl(roleName, "users.create"))
                            }
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Add New
                        </button>
                    )}
                </div>

                <TableFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                <DataTable
                    columns={columns}
                    data={sortedUsers}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                    renderRow={(u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">{u.id}</td>
                            <td className="px-4 py-4">{u.name}</td>
                            <td className="px-4 py-4">{u.email}</td>
                            <td className="px-4 py-4">
                                {u.role?.name || u.role_name}
                            </td>
                            <td className="px-4 py-4">
                                {u.department?.department ||
                                    u.department_name ||
                                    "-"}
                            </td>
                            <td className="px-4 py-4 flex gap-2">
                                {permissions.edit && (
                                    <Link
                                        href={roleUrl(
                                            roleName,
                                            "users.edit",
                                            u.id
                                        )}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {permissions.delete && (
                                    <button
                                        onClick={() => deleteUser(u.id)}
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
