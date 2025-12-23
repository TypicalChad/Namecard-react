import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { roleUrl, validRoutes } from "@/Utils/roleUrl";
import { Head } from "@inertiajs/react";
import {
    UserCircleIcon,
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    BuildingOffice2Icon,
    IdentificationIcon,
    ShieldCheckIcon,
    PowerIcon,
} from "@heroicons/react/24/outline";

// ICON mapping
const ICONS = {
    dashboard: <HomeIcon />,
    roles: <ShieldCheckIcon />,
    users: <UsersIcon />,
    companies: <BuildingOfficeIcon />,
    departments: <BuildingOffice2Icon />,
    namecards: <IdentificationIcon />,
    logout: <PowerIcon />,
};

// Sidebar icon component
const SidebarIcon = memo(({ type, isActive }) => {
    const className = `w-5 h-5 transition-all duration-200 ${
        isActive ? "scale-110" : ""
    }`;
    return ICONS[type]
        ? React.cloneElement(ICONS[type], { className, strokeWidth: 2.3 })
        : ICONS.dashboard;
});

export default function AdminLayout({ children, breadcrumbs: propCrumbs }) {
    const { props } = usePage();
    const { auth } = props;
    const rawUserRole = (auth?.user?.role?.name ?? "").toLowerCase().trim();
    const appName = "CBM_Namecards";
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const currentPath = useMemo(() => window.location.pathname, []);

    // Determine effective role dynamically
    const effectiveUserRole = useMemo(() => {
        if (rawUserRole.includes("normal user") || rawUserRole.includes("user"))
            return "user";
        else if (rawUserRole.includes("admin")) return "admin";
        return "admin";
    }, [rawUserRole]);

    // Dynamic menu items from validRoutes
    const allMenuItems = useMemo(() => {
        const icons = {
            dashboard: "dashboard",
            roles: "roles",
            users: "users",
            companies: "companies",
            departments: "departments",
            namecards: "namecards",
        };

        return Object.keys(validRoutes).flatMap((role) =>
            validRoutes[role].map((baseRoute) => {
                // Convert base route to full route for menu links
                let fullRoute = baseRoute;

                // Resource routes should default to .index
                const resourceRoutes = [
                    "namecards",
                    "departments",
                    "companies",
                    "roles",
                    "users",
                ];
                if (resourceRoutes.includes(baseRoute)) {
                    fullRoute = `${baseRoute}.index`;
                }

                return {
                    name: baseRoute
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" "),
                    route: fullRoute, // use full Ziggy route name
                    icon: icons[baseRoute] || "dashboard",
                    roles: [role],
                };
            })
        );
    }, []);

    // Filter menu items for current role
    const menuItems = useMemo(
        () =>
            allMenuItems
                .filter((item) => item.roles.includes(effectiveUserRole))
                .map((item) => ({
                    ...item,
                    path: roleUrl(effectiveUserRole, item.route),
                })),
        [allMenuItems, effectiveUserRole]
    );

    // Breadcrumbs
    const breadcrumbs = useMemo(() => {
        if (propCrumbs) return propCrumbs;

        const parts = currentPath.split("/").filter(Boolean);

        const pathParts = parts.filter(
            (p) => p.toLowerCase() !== effectiveUserRole
        );

        const isDashboardPage =
            pathParts.length === 0 || pathParts[0] === "dashboard";

        const crumbs = [];

        // ✅ Only add Dashboard if NOT already on dashboard
        if (!isDashboardPage) {
            crumbs.push({
                name: "Dashboard",
                href: roleUrl(effectiveUserRole, "dashboard"),
            });
        }

        let currentLink = `/${effectiveUserRole}`;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            currentLink += `/${part}`;

            // Capitalize nicely
            const name = part
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

            crumbs.push({
                name,
                href: i === pathParts.length - 1 ? null : currentLink,
            });
        }

        if (crumbs.length === 0) {
            crumbs.push({
                name: "Dashboard",
                href: null,
            });
        }

        return crumbs;
    }, [currentPath, propCrumbs, effectiveUserRole]);

    // Check active menu
    const isActive = (path) => {
        const normalizedCurrentPath = new URL(
            currentPath,
            window.location.origin
        ).pathname;
        const normalizedLinkPath = new URL(path, window.location.origin)
            .pathname;
        return (
            normalizedCurrentPath === normalizedLinkPath ||
            normalizedCurrentPath.startsWith(`${normalizedLinkPath}/`)
        );
    };

    useEffect(() => {
        if (route().current("profile.edit")) {
            setSidebarOpen(false);
        }
    }, [props]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <Head title={appName} />
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <aside
                    className={`${
                        sidebarOpen ? "w-80" : "w-20"
                    } bg-gradient-to-b from-slate-800 to-slate-900 text-gray-100 flex flex-col transition-all duration-500 ease-in-out shadow-2xl`}
                >
                    {/* Logo */}
                    <div
                        className="flex items-center justify-center gap-3 py-1.5 px-4 border-b border-slate-700/50"
                        style={{ backgroundColor: "#145369" }}
                    >
                        <div className="w-16 h-14 flex items-center justify-center overflow-hidden flex-shrink-0 relative -right-1.5">
                            <img
                                src="/images/logo-removebg-preview-white.png"
                                alt="Company Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span
                            className={`text-white font-bold text-lg tracking-wider whitespace-nowrap transition-all duration-500 uppercase leading-none relative top-1 ${
                                sidebarOpen
                                    ? "opacity-100 w-auto"
                                    : "opacity-0 w-0 overflow-hidden"
                            }`}
                        >
                            Digital Name Card
                        </span>
                    </div>

                    {/* User Info */}
                    <div
                        className={`${
                            sidebarOpen ? "px-3" : "px-2"
                        } py-3 mx-3 mt-4 bg-slate-700/40 backdrop-blur-sm rounded-xl border border-slate-600/40 transition-all duration-500 hover:bg-slate-700/50 hover:border-slate-500/50`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-600/50">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-800 shadow-sm"></div>
                            </div>
                            <div
                                className={`flex-1 min-w-0 transition-all duration-500 ${
                                    sidebarOpen
                                        ? "opacity-100"
                                        : "opacity-0 w-0 overflow-hidden"
                                }`}
                            >
                                <p className="text-sm font-semibold text-white truncate tracking-wide">
                                    {auth.user?.name}
                                </p>
                                <p className="text-xs text-slate-400 capitalize truncate mt-0.5">
                                    {auth.user?.role?.display_name ??
                                        auth.user?.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {menuItems.map((item, index) => {
                            const href = item.path;
                            if (!href || href === "#") return null;
                            const active = isActive(href);
                            return (
                                <div key={index} className="relative">
                                    <Link
                                        href={href}
                                        className={`group flex items-center rounded-lg ${
                                            sidebarOpen
                                                ? "gap-2 px-3"
                                                : "gap-0 px-2 justify-center"
                                        } py-3 transition-all duration-500 ${
                                            active
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                        }`}
                                    >
                                        <div
                                            className={`flex-shrink-0 ${
                                                active
                                                    ? "text-white"
                                                    : "text-slate-400 group-hover:text-white"
                                            } transition-colors`}
                                        >
                                            <SidebarIcon
                                                type={item.icon}
                                                isActive={active}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm font-medium whitespace-nowrap transition-all duration-500 ${
                                                sidebarOpen
                                                    ? "opacity-100 w-auto"
                                                    : "opacity-0 w-0 overflow-hidden"
                                            }`}
                                        >
                                            {item.name}
                                        </span>
                                        {active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
                        <div className="flex items-center justify-between px-6 py-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() =>
                                        setSidebarOpen((prev) => !prev)
                                    }
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all duration-1000"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {sidebarOpen ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        )}
                                    </svg>
                                </button>
                                {breadcrumbs?.length > 0 && (
                                    <nav className="text-sm flex items-center gap-2">
                                        {breadcrumbs.map((crumb, idx) => (
                                            <span
                                                key={idx}
                                                className="flex items-center gap-2"
                                            >
                                                {crumb.href ? (
                                                    <Link
                                                        href={crumb.href}
                                                        className={`hover:text-blue-600 transition-colors ${
                                                            idx ===
                                                            breadcrumbs.length -
                                                                1
                                                                ? "text-gray-900 font-semibold"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {crumb.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-900 font-semibold">
                                                        {crumb.name}
                                                    </span>
                                                )}
                                                {idx <
                                                    breadcrumbs.length - 1 && (
                                                    <svg
                                                        className="w-4 h-4 text-gray-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                        ))}
                                    </nav>
                                )}
                            </div>

                            {/* Profile */}
                            <div className="relative group" ref={profileRef}>
                                {/* ✅ TOGGLE BUTTON */}
                                <button
                                    onClick={() =>
                                        setProfileOpen((prev) => !prev)
                                    }
                                    className="flex items-center rounded-lg transition-all duration-300 bg-transparent"
                                >
                                    <UserCircleIcon className="w-6 h-6 text-gray-700" />

                                    {/* ✅ Name slides only when CLICKED */}
                                    <span
                                        className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out ${
                                            profileOpen
                                                ? "max-w-[200px] opacity-100 ml-2"
                                                : "max-w-0 opacity-0 ml-0"
                                        }`}
                                    >
                                        {auth.user?.name}
                                    </span>
                                </button>

                                {/* ✅ CLICK-BASED SLIDE-OUT DROPDOWN */}
                                <div
                                    className={`absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transform transition-all duration-300 origin-top ${
                                        profileOpen
                                            ? "scale-100 opacity-100 translate-y-0"
                                            : "scale-95 opacity-0 -translate-y-1 pointer-events-none"
                                    }`}
                                >
                                    {/* ✅ EDIT PROFILE BUTTON */}
                                    <Link
                                        href={route("profile.edit")}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                                    >
                                        <UserCircleIcon className="w-5 h-5" />
                                        Edit Profile
                                    </Link>

                                    {/* ✅ LOGOUT BUTTON */}
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-b-lg"
                                    >
                                        <PowerIcon className="w-5 h-5" />
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main
                        className="flex-1 overflow-y-auto p-6"
                        style={{ backgroundColor: "#fffdf2" }}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
