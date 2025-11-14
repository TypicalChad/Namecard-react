<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $user->loadMissing('role');
        $userRole = strtolower($user->role->name ?? '');
        $allowedRoles = array_map('strtolower', $roles);

        // Allow if fuzzy match (e.g. "Division Admin" matches "div")
        foreach ($allowedRoles as $allowed) {
            if (str_contains($userRole, $allowed)) {
                return $next($request);
            }
        }

        if ($userRole === 'div' && in_array($request->route()->getName(), [
            'div.roles.index',
            'div.roles.create',
            'div.roles.edit',
            'div.users.*',
            'div.companies.*',
            'div.media.*',
        ])) {
            abort(403, 'Unauthorized');
        }


        // Prevent redirect loop by NOT redirecting to dashboards
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->withErrors([
            'auth' => 'Unauthorized access.',
        ]);
    }
}
