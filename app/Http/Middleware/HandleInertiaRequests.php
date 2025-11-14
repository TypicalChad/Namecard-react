<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => Auth::user()->role ? [
                        'name' => Auth::user()->role->name,          // canonical key: "admin", "hr", "div"
                        'display_name' => Auth::user()->role->display_name, // UI-friendly
                    ] : null,
                ] : null,
            ],
            // Add any other shared data, like flash messages or permissions
        ]);
    }
}
