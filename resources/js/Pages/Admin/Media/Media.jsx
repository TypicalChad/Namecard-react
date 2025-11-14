import AdminLayout from "../../../Layouts/AdminLayout";
import { router, Link, usePage } from "@inertiajs/react";
import TableFilter from "@/Components/TableFilter";
import DataTable from "@/Components/DataTable";
import { useState } from "react";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import { useSortedFiltered } from "@/Hooks/useSortedFiltered";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";

export default function Media({ media, filters, breadcrumbs }) {
    const { props } = usePage();
    const auth = props?.auth;
    const { roleName, permissions } = useAuthPermissions("Media");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const currentPath = filters?.path || "/";

    const sortedMedia = useSortedFiltered(
        media,
        searchTerm,
        ["name", "type"],
        sortField,
        sortDir
    );

    const handleSort = (field) =>
        setSortField(field === sortField ? field : field) ||
        setSortDir(
            sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc"
        );

    const formatSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleNavigate = (item) => {
        if (item.type === "directory") {
            router.get(
                roleUrl(roleName, "media.index"),
                { path: item.path },
                { preserveState: true, replace: true }
            );
        }
    };

    const handleNavigateUp = () => {
        if (currentPath === "/") return;
        const parts = currentPath.split("/").filter(Boolean);
        parts.pop();
        const newPath = parts.length ? "/" + parts.join("/") : "/";
        router.get(
            roleUrl(roleName, "media.index"),
            { path: newPath },
            { preserveState: true, replace: true }
        );
    };

    const deleteMedia = (path) =>
        permissions.delete &&
        confirm("Delete this item?") &&
        router.delete(roleUrl(roleName, "media.destroy", path));

    const columns = [
        { label: "Name", field: "name", sortable: true },
        { label: "Type", field: "type", sortable: true },
        { label: "Size", field: "size", sortable: true },
        { label: "Modified", field: "modified", sortable: true },
        { label: "Actions" },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Media
                    </h2>
                    <div className="flex gap-2">
                        {currentPath !== "/" && (
                            <button
                                onClick={handleNavigateUp}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            >
                                Back
                            </button>
                        )}
                        {permissions.create && (
                            <button
                                onClick={() =>
                                    router.get(
                                        `${roleUrl(
                                            roleName,
                                            "media.create"
                                        )}?path=${encodeURIComponent(
                                            currentPath
                                        )}`
                                    )
                                }
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                                Upload New
                            </button>
                        )}
                    </div>
                </div>

                <TableFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                <DataTable
                    columns={columns}
                    data={sortedMedia}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={setSortField}
                    renderRow={(m) => (
                        <tr key={m.path} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-medium text-gray-800 relative group">
                                <div className="flex items-center">
                                    {m.type === "directory" ? (
                                        <FolderIcon className="w-5 h-5 mr-2 text-yellow-500" />
                                    ) : (
                                        <DocumentIcon className="w-5 h-5 mr-2 text-gray-500" />
                                    )}
                                    <span
                                        className={
                                            m.type === "directory"
                                                ? "text-blue-600 hover:underline cursor-pointer"
                                                : "cursor-default"
                                        }
                                        onClick={() =>
                                            m.type === "directory" &&
                                            handleNavigate(m)
                                        }
                                    >
                                        {m.name}
                                    </span>
                                </div>

                                {/* ✅ Hover preview — positioned bottom-right, scaled to fit */}
                                {m.type === "file" &&
                                    m.file_type &&
                                    m.file_type.startsWith("image/") && (
                                        <div className="fixed bottom-4 right-4 z-50 hidden group-hover:block bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                                            <img
                                                src={`/storage${m.path}`}
                                                alt={m.name}
                                                className="max-w-[300px] max-h-[300px] object-contain"
                                            />
                                        </div>
                                    )}

                                {m.type === "file" &&
                                    m.file_type &&
                                    m.file_type.startsWith("video/") && (
                                        <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20 hidden group-hover:block">
                                            <video
                                                src={`/storage${m.path}`}
                                                className="w-40 h-40 object-cover rounded-lg shadow-lg border border-gray-200 bg-white"
                                                controls
                                            />
                                        </div>
                                    )}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-500">
                                {m.type === "directory"
                                    ? "Folder"
                                    : m.file_type || "File"}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                                {m.type === "directory"
                                    ? "-"
                                    : formatSize(m.size)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                                {new Date(m.modified).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 flex gap-2">
                                {m.type !== "directory" && (
                                    <a
                                        href={`/storage${m.path}`}
                                        download
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                    >
                                        Download
                                    </a>
                                )}
                                {permissions.edit && (
                                    <Link
                                        href={roleUrl(
                                            roleName,
                                            "media.edit",
                                            m.path
                                        )}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Rename
                                    </Link>
                                )}
                                {permissions.delete && (
                                    <button
                                        onClick={() => deleteMedia(m.path)}
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
