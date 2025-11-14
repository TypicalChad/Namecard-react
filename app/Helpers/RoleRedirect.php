<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class RoleRedirect
{
    // ✅ Returns a redirect response (for controllers)
    public static function redirect(string $routeBase, string $action = 'index', array $params = [])
    {
        $role = strtolower(Auth::user()->role?->name ?? 'admin');
        $routeName = "{$role}.{$routeBase}.{$action}";
        return redirect()->route($routeName, $params);
    }

    // ✅ Returns the route name string only (for front-end helpers)
    public static function name(string $routeBase, string $action = 'index')
    {
        $role = strtolower(Auth::user()->role?->name ?? 'admin');
        return "{$role}.{$routeBase}.{$action}";
    }
}
