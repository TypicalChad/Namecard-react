// resources/js/Pages/Admin/Departments/CreateDepartment.jsx
import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";

export default function CreateDepartment({ companies }) {
    const role = usePage().props.auth?.user?.role || "";
    const { roleName } = useAuthPermissions("Departments");

    const { data, setData, post, errors, processing } = useForm({
        department: "",
        company_id: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(roleUrl(roleName, "departments.store"), {
            preserveScroll: true,
            onSuccess: () => console.log("Success!"),
            onError: (err) => console.log("Errors:", err),
        });
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow p-6 ">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Create New Department
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
                    <div className="flex justify-end gap-2">
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
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
