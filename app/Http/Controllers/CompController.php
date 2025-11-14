<?php

namespace App\Http\Controllers;

use App\Models\Comp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Helpers\RoleRedirect;


class CompController extends Controller
{
    private function authUserData(): array
    {
        $user = Auth::user();
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => Auth::user()->role?->display_name ?? Auth::user()->role?->name,
            'permissions' => $user->role?->permissions->Companies ?? [],
        ];
    }

    public function index()
    {
        return Inertia::render('Admin/Companies/Companies', [
            'companies' => Comp::latest()->get(),
            'auth' => ['user' => $this->authUserData()],
            'breadcrumbs' => [
                ['name' => 'Dashboard', 'href' => route('admin.dashboard')],
                ['name' => 'Companies', 'href' => null], // current page
            ],
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/Companies/Create', [
            'auth' => ['user' => $this->authUserData()],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate(array_merge(
            ['name' => 'required|string|max:255'],
            collect([
                'aboutus',
                'website',
                'address',
                'linkedin_company',
                'services',
                'cbm_link',
                'coy_banner_link',
                'product_link',
                'product_title',
                'coy_subsidiaries_link',
                'longitude',
                'altitude',
                'map_link',
                'background',
                'misc'
            ])->mapWithKeys(fn($f) => [$f => 'nullable'])->toArray(),
            [
                'coy_logo' => 'nullable|file',
                'coy_banner' => 'nullable|file',
                'coy_subsidiaries' => 'nullable|file',
                'product_image' => 'nullable|file',
                'default_image' => 'nullable|file',
            ]
        ));

        $savedFiles = [];
        foreach (['coy_logo', 'coy_banner', 'coy_subsidiaries', 'product_image', 'default_image'] as $file) {
            if ($request->hasFile($file)) {
                $path = $request->file($file)->store('companies', 'public');
                $data[$file] = $path;
                $savedFiles[$file] = $path;
            }
        }

        // Log what files were saved for debugging
        if (!empty($savedFiles)) {
            Log::info('CompController@store saved files', [
                'user_id' => Auth::id(),
                'user_name' => Auth::user()?->name,
                'saved_files' => $savedFiles,
            ]);
        }

        $data['create_user'] = Auth::user()->name ?? 'system';

        Comp::create($data);

        return RoleRedirect::redirect('companies', 'index')
            ->with('success', 'Company created successfully.');
    }

    public function edit(Comp $company)
    {
        return Inertia::render('Admin/Companies/Edit', [
            'company' => $company,
            'auth' => ['user' => $this->authUserData()],
        ]);
    }

    public function update(Request $request, Comp $company)
    {
        $data = $request->validate(array_merge(
            ['name' => 'required|string|max:255'],
            collect([
                'aboutus',
                'website',
                'address',
                'linkedin_company',
                'services',
                'cbm_link',
                'coy_banner_link',
                'product_link',
                'product_title',
                'coy_subsidiaries_link',
                'longitude',
                'altitude',
                'map_link',
                'background',
                'misc'
            ])->mapWithKeys(fn($f) => [$f => 'nullable'])->toArray(),
            [
                'coy_logo' => 'nullable|file',
                'coy_banner' => 'nullable|file',
                'coy_subsidiaries' => 'nullable|file',
                'product_image' => 'nullable|file',
                'default_image' => 'nullable|file',
            ]
        ));

        $updatedFiles = [];
        foreach (['coy_logo', 'coy_banner', 'coy_subsidiaries', 'product_image', 'default_image'] as $file) {

            if ($request->hasFile($file)) {
                Log::info('Checking for file upload for ' . $file . ': ' . ($request->hasFile($file) ? 'yes' : 'no'));
                // Optionally delete the old file if exists
                // if ($company->$file) {
                //     Storage::disk('public')->delete($company->$file);
                // }
                $path = $request->file($file)->store('companies', 'public');
                $data[$file] = $path;
                $updatedFiles[$file] = $path;
            } else {
                // retain old file path if exists
                $data[$file] = $company->$file;
            }
        }

        // if (!empty($updatedFiles)) {
        //     Log::info('CompController@update saved files', [
        //         'user_id' => Auth::id(),
        //         'user_name' => Auth::user()?->name,
        //         'company_id' => $company->id,
        //         'updated_files' => $updatedFiles,
        //     ]);
        // }

        $data['update_user'] = Auth::user()->name ?? 'system';
        $company->update($data);

        return RoleRedirect::redirect('companies', 'index')
            ->with('success', 'Company updated successfully.');
    }

    public function destroy(Comp $company)
    {
        foreach (['coy_logo', 'coy_banner', 'coy_subsidiaries', 'product_image', 'default_image'] as $file) {
            if ($company->$file) {
                Storage::disk('public')->delete($company->$file);
            }
        }

        $company->delete();

        return RoleRedirect::redirect('companies', 'index')
            ->with('success', 'Company deleted successfully.');
    }
}
