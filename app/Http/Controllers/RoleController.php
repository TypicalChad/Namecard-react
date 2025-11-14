<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Helpers\RoleRedirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Roles/Roles', [
            'roles' => Role::all(),
            'auth' => [
                'user' => Auth::user() ? [
                    'id' => Auth::id(),
                    'name' => Auth::user()->role->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role?->display_name ?? Auth::user()->role?->name,
                ] : null,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Roles/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'display_name' => 'nullable|string|max:255',
        ]);

        Role::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
        ]);

        return RoleRedirect::redirect('roles', 'index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        return Inertia::render('Admin/Roles/Edit', ['role' => $role]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'display_name' => 'nullable|string|max:255',
        ]);

        $role->update([
            'name' => $request->name,
            'display_name' => $request->display_name,
        ]);

        return RoleRedirect::redirect('roles', 'index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return RoleRedirect::redirect('roles', 'index')
            ->with('success', 'Role deleted successfully.');
    }
}
