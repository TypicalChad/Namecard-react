import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";
import { useMemo, useEffect } from "react";

export default function EditNamecard({
    namecard,
    companies = [],
    departments = [],
    breadcrumbs,
}) {
    const { roleName } = useAuthPermissions("Namecards");

    const { data, setData, post, processing, errors } = useForm({
        first_name: namecard.first_name || "",
        last_name: namecard.last_name || "",
        name: namecard.name || "",
        position: namecard.position || "",
        company_id: namecard.company_id || "",
        department_id: namecard.department_id || "",
        email: namecard.email || "",
        linkedin_personal: namecard.linkedin_personal || "",
        mobile_number: namecard.mobile_number || "",
        office_number: namecard.office_number || "",
        image: null,
        _method: "PUT",
    });

    // Filter departments based on selected company ID
    const filteredDepartments = useMemo(() => {
        return departments.filter(
            (d) => Number(d.company_id) === Number(data.company_id)
        );
    }, [data.company_id, departments]);

    // Clear department if it doesn't belong to selected company
    useEffect(() => {
        if (
            data.department_id &&
            !filteredDepartments.some(
                (d) => Number(d.id) === Number(data.department_id)
            )
        ) {
            setData("department_id", "");
        }
    }, [filteredDepartments]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value === null ? "" : value);
        });

        post(roleUrl(roleName, "namecards.update", namecard.id), formData, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="bg-white rounded-lg shadow p-6 ">
                <h2 className="text-xl font-semibold mb-4">Edit Namecard</h2>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
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
                            <div className="text-red-500 text-xs">
                                {errors.first_name}
                            </div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
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
                            <div className="text-red-500 text-xs">
                                {errors.last_name}
                            </div>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                        {errors.name && (
                            <div className="text-red-500 text-xs">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
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
                        <label className="block text-sm font-medium mb-1">
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
                            <div className="text-red-500 text-xs">
                                {errors.company_id}
                            </div>
                        )}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Department
                        </label>
                        <select
                            value={data.department_id}
                            onChange={(e) =>
                                setData("department_id", e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        >
                            <option value="">Select department</option>
                            {filteredDepartments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.department}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <div className="text-red-500 text-xs">
                                {errors.department_id}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                        />
                        {errors.email && (
                            <div className="text-red-500 text-xs">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
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
                            <div className="text-red-500 text-xs">
                                {errors.linkedin_personal}
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
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

                    {/* Office */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
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
                        <label className="block text-sm font-medium mb-1">
                            Image
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("image", e.target.files[0])
                            }
                            className="w-full"
                        />

                        {/* Existing image preview */}
                        {namecard.image && !data.image && (
                            <img
                                src={`/storage/${namecard.image}`}
                                alt={namecard.name}
                                className="w-32 h-32 mt-2 object-cover rounded"
                            />
                        )}

                        {/* New image preview */}
                        {data.image && (
                            <img
                                src={URL.createObjectURL(data.image)}
                                alt="Preview"
                                className="w-32 h-32 mt-2 object-cover rounded"
                            />
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
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
