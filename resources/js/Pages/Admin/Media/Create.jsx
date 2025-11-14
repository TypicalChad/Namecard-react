import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";

export default function CreateMedia() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        file: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const { roleName } = useAuthPermissions("Media");

    useEffect(() => {
        // clean up preview URL when component unmounts or file changes
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;
        setData("file", file);
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Send as FormData to support file upload
        post(roleUrl(roleName, "media.store"), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
                <h1 className="text-xl font-semibold mb-4">Upload Media</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">File</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                        {errors.file && (
                            <p className="text-red-500 text-sm">
                                {errors.file}
                            </p>
                        )}
                    </div>

                    {previewUrl && (
                        <div className="mt-2">
                            <p className="text-sm mb-1">Preview:</p>
                            <img
                                src={previewUrl}
                                alt="preview"
                                className="max-h-60 rounded shadow"
                            />
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
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
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
