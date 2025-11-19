import { roleUrl } from "@/Utils/roleUrl";
import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { useMemo } from "react";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";

export default function CreateUser({ roles, departments, breadcrumbs }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        role_id: "",
        department_id: "",
    });

    const { roleName } = useAuthPermissions("Users");

    // Remove duplicates (no overlapping departments)
    const uniqueDepartments = useMemo(() => {
        const seen = new Set();
        return departments.filter((dep) => {
            const lowerName = dep.department.trim().toLowerCase();
            if (seen.has(lowerName)) return false;
            seen.add(lowerName);
            return true;
        });
    }, [departments]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(roleUrl(roleName, "users.store"), {
            preserveScroll: true,
            onSuccess: () => console.log("Success!"),
            onError: (err) => console.log("Errors:", err),
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow p-6 ">
                <h2 className="text-xl font-semibold mb-4">Create New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            value={data.role_id}
                            onChange={(e) => setData("role_id", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        >
                            <option value="">Select a role</option>
                            {roles?.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <p className="text-red-500 text-sm">
                                {errors.role_id}
                            </p>
                        )}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <select
                            value={data.department_id}
                            onChange={(e) =>
                                setData("department_id", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                            required
                        >
                            <option value="">Select a department</option>
                            {uniqueDepartments?.map((dep) => (
                                <option key={dep.id} value={dep.id}>
                                    {dep.department}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <p className="text-red-500 text-sm">
                                {errors.department_id}
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
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
