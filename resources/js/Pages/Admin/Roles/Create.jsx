import AdminLayout from "../../../Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { roleUrl } from "@/Utils/roleUrl";

export default function CreateRole() {
    // Initialize form state with only name
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(roleUrl("admin", "roles.store"), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Role created successfully!");
                reset();
            },
            onError: (err) => {
                console.error("Form errors:", err);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow p-6 ">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Create New Role
                </h2>

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
                                    ? "bg-green-300 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                            }`}
                        >
                            {processing ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
