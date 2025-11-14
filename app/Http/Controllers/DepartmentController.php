<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Comp;
use Illuminate\Validation\Rule;
use App\Helpers\RoleRedirect;

class DepartmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Departments/Departments', [
            'departments' => Department::with('company')->get(),
            'auth' => [
                'user' => Auth::user() ? [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role?->display_name ?? Auth::user()->role?->name,
                    'permissions' => Auth::user()->role?->permissions, // Pass permissions
                ] : null,
            ],
        ]);
    }

    public function create()
    {
        $companies = Comp::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Admin/Departments/Create', [
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'department' => [
                'required',
                'string',
                'max:255',
                Rule::unique('departments')->where('company_id', $request->company_id),
            ],
            'company_id' => 'nullable|integer',
        ]);

        Department::create([
            'department' => $request->department,
            'company_id' => $request->company_id ?? null,
            'create_user' => Auth::user()->name ?? 'system',
            'update_user' => Auth::user()->name ?? 'system',
        ]);

        return RoleRedirect::redirect('departments', 'index')->with('success', 'Department created successfully.');
    }

    public function edit($id)
    {
        $department = Department::findOrFail($id);
        $companies = Comp::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Departments/Edit', [
            'department' => $department,
            'companies' => $companies,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'department' => [
                'required',
                'string',
                'max:255',
                Rule::unique('departments')->where('company_id', $request->company_id)->ignore($id),
            ],
            'company_id' => 'nullable|integer',
        ]);

        Department::where('id', $id)->update([
            'department' => $request->department,
            'company_id' => $request->company_id ?? null,
            'update_user' => Auth::user()->name ?? 'system',
        ]);

        return RoleRedirect::redirect('departments', 'index')->with('success', 'Department updated successfully.');
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return RoleRedirect::redirect('departments', 'index')->with('success', 'Department deleted successfully.');
    }
}
