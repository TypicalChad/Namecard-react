// resources/js/Pages/Admin/Departments/EditDepartment.jsx
import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";

export default function EditDepartment({ department, breadcrumbs, companies }) {
    const role = usePage().props.auth?.user?.role || "";

    const { data, setData, post, errors, processing } = useForm({
        department: department.department || "",
        company_id: department.company_id || null,
        _method: "PUT",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const target = route(role, "departments.update", department.id);
        post(target);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Edit Department
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Department Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department Name
                        </label>
                        <input
                            type="text"
                            value={data.department}
                            onChange={(e) =>
                                setData("department", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        />
                        {errors.department && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.department}
                            </p>
                        )}
                    </div>

                    {/* Company Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                        </label>
                        <select
                            value={data.company_id || ""}
                            onChange={(e) =>
                                setData(
                                    "company_id",
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : null
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        >
                            <option value="">Select a company</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.company_id && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.company_id}
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
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
