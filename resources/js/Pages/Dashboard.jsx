import AdminLayout from "../Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import React, { useEffect } from "react";

export default function Dashboard({ profile, actions }) {
    // const { props } = usePage();

    // useEffect(() => {
    //     console.log("Dashboard page Inertia props:", props);
    //     console.log("Logged in user role object:", props?.auth?.user?.role);
    // }, [props]);

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 gap-6">
                {/* Profile */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                    <div className="space-y-2">
                        <div>
                            <strong>Name:</strong> {profile.name}
                        </div>
                        <div>
                            <strong>Email:</strong> {profile.email}
                        </div>
                        <div>
                            <strong>Role:</strong> {profile.role}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                {actions.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Actions
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {actions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => router.visit(action.url)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
