import AdminLayout from "../../../Layouts/AdminLayout";
import { router, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { roleUrl } from "@/Utils/roleUrl";
import TableFilter from "@/Components/TableFilter";
import DataTable from "@/Components/DataTable";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import { useSortedFiltered } from "@/Hooks/useSortedFiltered";

export default function Departments({ departments, breadcrumbs }) {
    const { props } = usePage();
    const auth = props?.auth;
    const { roleName, permissions } = useAuthPermissions("Departments");

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");

    // Filtering & sorting
    const sortedDepartments = useSortedFiltered(
        departments,
        searchTerm,
        ["department", "acronym", "company.name"],
        sortField,
        sortDir
    );

    const handleSort = (field) =>
        setSortField(field === sortField ? field : field) ||
        setSortDir(
            sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc"
        );

    const deleteDepartment = (id) =>
        permissions.delete &&
        confirm("Delete this department?") &&
        router.post(roleUrl(roleName, "departments.destroy", id), {
            _method: "DELETE",
        });

    const columns = [
        { label: "Company ID", field: "company.id", sortable: true },
        { label: "Department", field: "department", sortable: true },
        { label: "Company Name", field: "company.name", sortable: true },
        { label: "Actions" },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Departments
                    </h2>
                    {permissions.create && (
                        <button
                            onClick={() =>
                                router.get(
                                    roleUrl(roleName, "departments.create")
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
                    data={sortedDepartments}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                    renderRow={(d) => (
                        <tr key={d.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                                {d.company?.id ?? "-"}
                            </td>
                            <td className="px-4 py-4">{d.department}</td>
                            <td className="px-4 py-4">
                                {d.company?.name ?? "-"}
                            </td>
                            <td className="px-4 py-4 flex gap-2 justify-center">
                                {permissions.edit && (
                                    <Link
                                        href={roleUrl(
                                            roleName,
                                            "departments.edit",
                                            d.id
                                        )}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {permissions.delete && (
                                    <button
                                        onClick={() => deleteDepartment(d.id)}
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
