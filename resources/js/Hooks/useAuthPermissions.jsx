import { usePage } from "@inertiajs/react";

export function useAuthPermissions(moduleName) {
    const { props } = usePage();
    const user = props?.auth?.user;

    // Normalize role to match validRoutes keys
    let roleNameRaw = user?.role?.name?.toLowerCase() || "";
    let roleName;
    if (roleNameRaw.includes("user")) roleName = "user";
    else roleName = "admin"; // default/fallback

    //console.log("User role raw:", user?.role?.name);
    //console.log("Normalized roleName:", roleName);

    const defaultPerms = {
        create: true,
        edit: true,
        delete: true,
        view: true,
    };

    const permissions = user?.role?.permissions?.[moduleName] ?? defaultPerms; // allow all for simplicity

    return { roleName, permissions };
}
