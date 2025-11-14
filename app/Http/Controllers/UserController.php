<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Department;
use App\Models\Comp;
use App\Helpers\RoleRedirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $role = Auth::user()->role?->name;
            abort_unless(in_array($role, ['Admin', 'HR']), 403, 'Unauthorized');
            return $next($request);
        })->only(['store', 'update', 'destroy', 'create', 'edit']);
    }

    private function authUserData(): array
    {
        $user = Auth::user();
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => Auth::user()->role?->display_name ?? Auth::user()->role?->name,
            'permissions' => $user->role?->permissions,
        ];
    }

    public function index()
    {
        $users = User::with(['role', 'company', 'department'])->get();

        $breadcrumbs = [
            ['name' => 'Dashboard', 'href' => route('dashboard')],
            ['name' => 'Users', 'href' => null],
        ];

        return Inertia::render('Admin/Users/Users', [
            'users' => $users,
            'breadcrumbs' => $breadcrumbs,
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all(),
            'departments' => Department::all(),
            'companies' => Comp::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
            'company_id' => 'nullable|exists:comps,id',
        ]);

        User::create(array_merge(
            $validated,
            ['password' => Hash::make($validated['password'])]
        ));

        return RoleRedirect::redirect('users', 'index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load(['department', 'company']),
            'roles' => Role::all(),
            'departments' => Department::all(),
            'companies' => Comp::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
            'company_id' => 'nullable|exists:comps,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
            'department_id' => $validated['department_id'] ?? null,
            'company_id' => $validated['company_id'] ?? null,
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
        ]);

        return RoleRedirect::redirect('users', 'index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return RoleRedirect::redirect('users', 'index')
            ->with('success', 'User deleted successfully.');
    }
}
