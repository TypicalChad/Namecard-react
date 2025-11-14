<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Prepare profile info
        $profile = [
            'name' => $user->name,
            'email' => $user->email,
            'company' => $user->company?->name ?? '—',
            'department' => $user->department?->department ?? '—',
            'role' => Auth::user()->role?->display_name ?? Auth::user()->role?->name,
        ];

        // Role-based quick actions
        $roleName = strtolower($user->role?->name ?? '');
        $prefix = match (true) {
            str_contains($roleName, 'div') => 'div',
            str_contains($roleName, 'hr') => 'hr',
            str_contains($roleName, 'admin') => 'admin',
            default => 'admin',
        };

        $actions = [
            [
                'label' => 'Add Department',
                'url' => route("{$prefix}.departments.create"),
            ],
            [
                'label' => 'Add Namecard',
                'url' => route("{$prefix}.namecards.create"),
            ],
        ];

        // Only HR and Admin can access Companies
        if (in_array($prefix, ['hr', 'admin'])) {
            $actions[] = [
                'label' => 'Add Company',
                'url' => route("{$prefix}.companies.create"),
            ];
        }

        return Inertia::render('Dashboard', [
            'profile' => $profile,
            'actions' => $actions,
        ]);
    }
}
