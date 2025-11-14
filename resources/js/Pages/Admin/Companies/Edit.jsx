import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Editor } from "@tinymce/tinymce-react";
import { roleUrl } from "@/Utils/roleUrl";
import { useAuthPermissions } from "@/Hooks/useAuthPermissions";

export default function EditCompany({ company, breadcrumbs }) {
    const { data, setData, post, processing, errors } = useForm({
        name: company.name || "",
        aboutus: company.aboutus || "",
        website: company.website || "",
        address: company.address || "",
        linkedin_company: company.linkedin_company || "",
        services: company.services || "",
        cbm_link: company.cbm_link || "",
        coy_logo: null,
        coy_banner: null,
        coy_subsidiaries: null,
        coy_banner_link: company.coy_banner_link || "",
        product_image: null,
        product_link: company.product_link || "",
        product_title: company.product_title || "",
        coy_subsidiaries_link: company.coy_subsidiaries_link || "",
        longitude: company.longitude || "",
        altitude: company.altitude || "",
        map_link: company.map_link || "",
        background: company.background || "",
        misc: company.misc || "",
        default_image: null,
        _method: "PUT",
    });

    const [previews, setPreviews] = useState({
        coy_logo: company.coy_logo ? `/storage/${company.coy_logo}` : null,
        coy_banner: company.coy_banner
            ? `/storage/${company.coy_banner}`
            : null,
        coy_subsidiaries: company.coy_subsidiaries
            ? `/storage/${company.coy_subsidiaries}`
            : null,
        product_image: company.product_image
            ? `/storage/${company.product_image}`
            : null,
        default_image: company.default_image
            ? `/storage/${company.default_image}`
            : null,
    });

    const { roleName } = useAuthPermissions("Companies");
    useEffect(() => {
        return () => {
            Object.values(previews).forEach((url) => {
                if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    const handleFileChange = (field) => (e) => {
        const file = e.target.files[0] || null;
        setData(field, file);
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [field]: url }));
        } else {
            setPreviews((prev) => ({ ...prev, [field]: previews[field] })); // Keep existing if no new file
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.companies.update", { id: company.id }), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
                <h1 className="text-xl font-semibold mb-4">Edit Company</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">About Us</label>
                        <Editor
                            apiKey="ddtae9le8oylfm76i7op976hya440qisatd7fpuzth7fmmxs"
                            value={data.aboutus}
                            init={{
                                height: 300,
                                menubar: false,
                                plugins: [
                                    "advlist",
                                    "autolink",
                                    "lists",
                                    "link",
                                    "image",
                                    "charmap",
                                    "preview",
                                    "anchor",
                                    "searchreplace",
                                    "visualblocks",
                                    "code",
                                    "fullscreen",
                                    "insertdatetime",
                                    "media",
                                    "table",
                                    "help",
                                    "wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                            }}
                            onEditorChange={(content) =>
                                setData("aboutus", content)
                            }
                        />
                        {errors.aboutus && (
                            <p className="text-red-500 text-sm">
                                {errors.aboutus}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Website</label>
                        <input
                            type="text"
                            value={data.website}
                            onChange={(e) => setData("website", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.website && (
                            <p className="text-red-500 text-sm">
                                {errors.website}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Address</label>
                        <Editor
                            apiKey="ddtae9le8oylfm76i7op976hya440qisatd7fpuzth7fmmxs"
                            value={data.address}
                            init={{
                                height: 200,
                                menubar: false,
                                plugins: [
                                    "advlist",
                                    "autolink",
                                    "lists",
                                    "link",
                                    "image",
                                    "charmap",
                                    "preview",
                                    "anchor",
                                    "searchreplace",
                                    "visualblocks",
                                    "code",
                                    "fullscreen",
                                    "insertdatetime",
                                    "media",
                                    "table",
                                    "help",
                                    "wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                            }}
                            onEditorChange={(content) =>
                                setData("address", content)
                            }
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">
                                {errors.address}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">LinkedIn Company</label>
                        <input
                            type="text"
                            value={data.linkedin_company}
                            onChange={(e) =>
                                setData("linkedin_company", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.linkedin_company && (
                            <p className="text-red-500 text-sm">
                                {errors.linkedin_company}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Services</label>
                        <input
                            type="text"
                            value={data.services}
                            onChange={(e) =>
                                setData("services", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.services && (
                            <p className="text-red-500 text-sm">
                                {errors.services}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">CBM Link</label>
                        <input
                            type="text"
                            value={data.cbm_link}
                            onChange={(e) =>
                                setData("cbm_link", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.cbm_link && (
                            <p className="text-red-500 text-sm">
                                {errors.cbm_link}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Company Logo</label>
                        <input
                            type="file"
                            onChange={handleFileChange("coy_logo")}
                            className="w-full"
                        />
                        {errors.coy_logo && (
                            <p className="text-red-500 text-sm">
                                {errors.coy_logo}
                            </p>
                        )}
                        {previews.coy_logo && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">Preview:</p>
                                <img
                                    src={previews.coy_logo}
                                    alt="logo preview"
                                    className="max-h-60 rounded shadow"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Company Banner</label>
                        <input
                            type="file"
                            onChange={handleFileChange("coy_banner")}
                            className="w-full"
                        />
                        {errors.coy_banner && (
                            <p className="text-red-500 text-sm">
                                {errors.coy_banner}
                            </p>
                        )}
                        {previews.coy_banner && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">Preview:</p>
                                <img
                                    src={previews.coy_banner}
                                    alt="banner preview"
                                    className="max-h-60 rounded shadow"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">
                            Company Subsidiaries
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange("coy_subsidiaries")}
                            className="w-full"
                        />
                        {errors.coy_subsidiaries && (
                            <p className="text-red-500 text-sm">
                                {errors.coy_subsidiaries}
                            </p>
                        )}
                        {previews.coy_subsidiaries && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">Preview:</p>
                                <img
                                    src={previews.coy_subsidiaries}
                                    alt="subsidiaries preview"
                                    className="max-h-60 rounded shadow"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">
                            Company Banner Link
                        </label>
                        <input
                            type="text"
                            value={data.coy_banner_link}
                            onChange={(e) =>
                                setData("coy_banner_link", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.coy_banner_link && (
                            <p className="text-red-500 text-sm">
                                {errors.coy_banner_link}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Product Image</label>
                        <input
                            type="file"
                            onChange={handleFileChange("product_image")}
                            className="w-full"
                        />
                        {errors.product_image && (
                            <p className="text-red-500 text-sm">
                                {errors.product_image}
                            </p>
                        )}
                        {previews.product_image && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">Preview:</p>
                                <img
                                    src={previews.product_image}
                                    alt="product preview"
                                    className="max-h-60 rounded shadow"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Product Link</label>
                        <input
                            type="text"
                            value={data.product_link}
                            onChange={(e) =>
                                setData("product_link", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.product_link && (
                            <p className="text-red-500 text-sm">
                                {errors.product_link}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Product Title</label>
                        <input
                            type="text"
                            value={data.product_title}
                            onChange={(e) =>
                                setData("product_title", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.product_title && (
                            <p className="text-red-500 text-sm">
                                {errors.product_title}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">
                            Company Subsidiaries Link
                        </label>
                        <input
                            type="text"
                            value={data.coy_subsidiaries_link}
                            onChange={(e) =>
                                setData("coy_subsidiaries_link", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.coy_subsidiaries_link && (
                            <p className="text-red-500 text-sm">
                                {errors.coy_subsidiaries_link}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Longitude</label>
                        <input
                            type="text"
                            value={data.longitude}
                            onChange={(e) =>
                                setData("longitude", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.longitude && (
                            <p className="text-red-500 text-sm">
                                {errors.longitude}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Altitude</label>
                        <input
                            type="text"
                            value={data.altitude}
                            onChange={(e) =>
                                setData("altitude", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.altitude && (
                            <p className="text-red-500 text-sm">
                                {errors.altitude}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Map Link</label>
                        <input
                            type="text"
                            value={data.map_link}
                            onChange={(e) =>
                                setData("map_link", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.map_link && (
                            <p className="text-red-500 text-sm">
                                {errors.map_link}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Background</label>
                        <input
                            type="text"
                            value={data.background}
                            onChange={(e) =>
                                setData("background", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.background && (
                            <p className="text-red-500 text-sm">
                                {errors.background}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Misc</label>
                        <input
                            type="text"
                            value={data.misc}
                            onChange={(e) => setData("misc", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.misc && (
                            <p className="text-red-500 text-sm">
                                {errors.misc}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Default Image</label>
                        <input
                            type="file"
                            onChange={handleFileChange("default_image")}
                            className="w-full"
                        />
                        {errors.default_image && (
                            <p className="text-red-500 text-sm">
                                {errors.default_image}
                            </p>
                        )}
                        {previews.default_image && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">Preview:</p>
                                <img
                                    src={previews.default_image}
                                    alt="default preview"
                                    className="max-h-60 rounded shadow"
                                />
                            </div>
                        )}
                    </div>
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
