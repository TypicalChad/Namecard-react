import React from "react";
import { Link } from "@inertiajs/react";
import {
    HomeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

                <nav className="flex flex-col gap-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-800"
                    >
                        <HomeIcon className="w-5 h-5" />
                        Home
                    </Link>

                    <Link
                        href="/reports"
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-800"
                    >
                        <ChartBarIcon className="w-5 h-5" />
                        Reports
                    </Link>

                    <Link
                        href="/settings"
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-800"
                    >
                        <Cog6ToothIcon className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
    );
}
