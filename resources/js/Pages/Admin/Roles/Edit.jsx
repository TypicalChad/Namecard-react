// resources/js/Pages/Admin/Roles/Edit.jsx
import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function EditRole({ role, breadcrumbs }) {
    const { data, setData, post, processing, errors } = useForm({
        name: role.name,
        display_name: role.display_name,
        _method: "PUT",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.roles.update", { id: role.id }), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto mt-8">
                <h2 className="text-xl font-semibold mb-4">Edit Role</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={data.display_name}
                            onChange={(e) =>
                                setData("display_name", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-4 py-2 rounded text-white ${
                                processing
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        >
                            {processing ? "Updating..." : "Update Role"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
