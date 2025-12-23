import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { useState } from "react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [activeSection, setActiveSection] = useState("view");
    const user = auth.user;

    return (
        <AdminLayout>
            <Head title="My Profile" />
            <div className="max-w-8xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* LEFT SIDEBAR */}
                    <aside className="lg:col-span-1 space-y-4">
                        <h3 className="font-semibold text-lg">
                            Account Actions
                        </h3>

                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveSection("profile")}
                                className={`w-full text-left px-3 py-2 rounded-full ${
                                    activeSection === "profile"
                                        ? "font-semibold hover:bg-gray-100"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                Update Profile
                            </button>

                            <button
                                onClick={() => setActiveSection("password")}
                                className={`w-full text-left px-3 py-2 rounded-full ${
                                    activeSection === "password"
                                        ? "font-semibold hover:bg-gray-100"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                Change Password
                            </button>

                            <button
                                onClick={() => setActiveSection("delete")}
                                className={`w-full text-left px-3 py-2 rounded-full text-red-600 ${
                                    activeSection === "delete"
                                        ? "font-semibold hover:bg-red-50"
                                        : "hover:bg-red-50"
                                }`}
                            >
                                Delete Account
                            </button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="lg:col-span-3">
                        {/* PROFILE VIEW */}
                        {activeSection === "view" && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h1 className="text-2xl font-bold mb-4">
                                    My Profile
                                </h1>

                                <div className="space-y-2">
                                    <div>
                                        <strong>Name:</strong> {user.name}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> {user.email}
                                    </div>
                                    <div>
                                        <strong>Role:</strong> {user.role}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveSection("profile")}
                                    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Update Details
                                </button>
                            </div>
                        )}

                        {/* UPDATE PROFILE */}
                        {activeSection === "profile" && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    onCancel={() => setActiveSection("view")}
                                />
                            </div>
                        )}

                        {/* UPDATE PASSWORD */}
                        {activeSection === "password" && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <UpdatePasswordForm
                                    onCancel={() => setActiveSection("view")}
                                />
                            </div>
                        )}

                        {/* DELETE USER */}
                        {activeSection === "delete" && (
                            <div className="bg-white rounded-lg shadow p-6 border border-red-200">
                                <DeleteUserForm
                                    onCancel={() => setActiveSection("view")}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AdminLayout>
    );
}
