import { route } from "ziggy-js";

// Define valid base routes per internal role key
export const validRoutes = {
    admin: ["dashboard", "roles", "users", "media", "companies", "departments", "namecards"],
    user: ["dashboard", "namecards"],
};

export const roleUrl = (role, name, params = {}) => {
    if (!name) return "#";

    const cleanRole = (role || "").toLowerCase().trim();
    const baseRoute = name.split(".")[0]; // only check the base route

    let prefix = "admin"; // fallback if no match found

    // Use role prefix if role is valid and base route is allowed
    if (cleanRole in validRoutes && validRoutes[cleanRole].includes(baseRoute)) {
        prefix = cleanRole;
    } else {
        // Fallback: find the first role that allows this base route
        for (const key of Object.keys(validRoutes)) {
            if (validRoutes[key].includes(baseRoute)) {
                prefix = key;
                break;
            }
        }
    }

    // Return full Ziggy route: prefix + full route name
    return route(`${prefix}.${name}`, params);
};
