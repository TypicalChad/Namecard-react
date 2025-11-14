import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import { useMemo, useEffect } from "react";
import { Linkedin } from "lucide-react";

export default function CreateNamecard({
    breadcrumbs,
    companies = [],
    departments = [],
}) {
    const { roleName } = useAuthPermissions("Namecards");

    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        name: "",
        position: "",
        company_id: "", // Use company_id, not company name
        department_id: "",
        email: "",
        linkedin: "",
        mobile_number: "",
        office_number: "",
        image: null,
    });

    // Filter departments based on selected company_id
    const filteredDepartments = useMemo(() => {
        if (!data.company_id) return [];
        return departments.filter(
            (d) => Number(d.company_id) === Number(data.company_id)
        );
    }, [data.company_id, departments]);

    // Reset department_id if it no longer belongs to selected company
    useEffect(() => {
        if (
            data.department_id &&
            !filteredDepartments.find(
                (d) => Number(d.id) === Number(data.department_id)
            )
        ) {
            setData("department_id", "");
        }
    }, [filteredDepartments]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (typeof data[key] !== "undefined")
                formData.append(key, data[key]);
        });
        post(roleUrl(roleName, "namecards.store"), formData, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-8">
                <h2 className="text-xl font-semibold mb-4">Create Namecard</h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    encType="multipart/form-data"
                >
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm">
                                {errors.last_name}
                            </p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                        </label>
                        <input
                            type="text"
                            value={data.position}
                            onChange={(e) =>
                                setData("position", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                        </label>
                        <select
                            value={data.company_id}
                            onChange={(e) =>
                                setData("company_id", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        >
                            <option value="">Select company</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.company_id && (
                            <p className="text-red-500 text-sm">
                                {errors.company_id}
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
                        >
                            <option value="">Select a department</option>
                            {filteredDepartments.map((dep) => (
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
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            LinkedIn
                        </label>
                        <input
                            type="text"
                            value={data.linkedin_personal}
                            onChange={(e) =>
                                setData("linkedin_personal", e.target.value)
                            }
                            placeholder="https://linkedin.com/in/username"
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                        {errors.linkedin_personal && (
                            <p className="text-red-500 text-sm">
                                {errors.linkedin_personal}
                            </p>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            value={data.mobile_number}
                            onChange={(e) =>
                                setData("mobile_number", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                    </div>

                    {/* Office Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Office Number
                        </label>
                        <input
                            type="text"
                            value={data.office_number}
                            onChange={(e) =>
                                setData("office_number", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("image", e.target.files[0])
                            }
                            className="w-full"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm">
                                {errors.image}
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
