<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Helpers\RoleRedirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class MediaController extends Controller
{
    private function authUserData(): array
    {
        $user = Auth::user();
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => Auth::user()->role?->display_name ?? Auth::user()->role?->name,
            'permissions' => $user->role?->permissions ?? [],
        ];
    }

    public function index(Request $request)
    {
        $path = rtrim($request->query('path', '/'), '/') . '/';
        $disk = Storage::disk('public');

        $directories = $disk->directories($path);
        $files = $disk->files($path);

        $media = [];

        // Folders
        foreach ($directories as $dir) {
            $media[] = [
                'name' => basename($dir),
                'type' => 'directory',
                'path' => '/' . ltrim($dir, '/'),
                'modified' => $disk->lastModified($dir),
            ];
        }

        // Files
        foreach ($files as $file) {
            $fullPath = $disk->path($file);
            $media[] = [
                'name' => basename($file),
                'type' => 'file',
                'path' => '/' . ltrim($file, '/'),
                'size' => $disk->size($file),
                'modified' => $disk->lastModified($file),
                'file_type' => File::mimeType($fullPath),
            ];
        }

        usort($media, fn($a, $b) => strcmp($a['name'], $b['name']));

        $role = strtolower(Auth::user()->role?->display_name ?? Auth::user()->role?->name);
        $component = match ($role) {
            'admin' => 'Admin/Media/Media',
            'hr' => 'HR/Media/Media',
            'div' => 'Div/Media/Media',
            default => 'Admin/Media/Media',
        };

        return Inertia::render($component, [
            'auth' => ['user' => $this->authUserData()],
            'media' => $media,
            'filters' => $request->all(),
            'breadcrumbs' => [
                ['name' => 'Dashboard', 'href' => route('admin.dashboard')],
                ['name' => 'Media', 'href' => null], // current page
            ],
        ]);
    }




    public function create()
    {
        return Inertia::render('Admin/Media/Create', [
            'auth' => ['user' => $this->authUserData()],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'path' => 'nullable|string',
            'name' => 'required|string',
            'type' => 'required|string',
        ]);

        $disk = Storage::disk('public');
        $currentPath = rtrim($request->path ?? '/', '/'); // e.g., "uploads"
        $fullPath = $currentPath === '/' ? $request->name : $currentPath . '/' . $request->name;

        if ($request->type === 'directory') {
            // Create the folder in public/storage
            if (!$disk->exists($fullPath)) {
                $disk->makeDirectory($fullPath);
            }

            return RoleRedirect::redirect('media', 'index')
                ->with('success', 'Folder created successfully.');
        }

        // Existing file upload logic (optional)
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file',
        ]);

        $folder = 'media/' . now()->format('M') . now()->year;
        $validated['file_path'] = $request->file('file')->store($folder, 'public');
        $validated['file_type'] = $request->file('file')->getClientMimeType();

        Media::create($validated);

        return RoleRedirect::redirect('media', 'index')
            ->with('success', 'Media created successfully.');
    }


    public function destroy(Media $media)
    {
        Storage::disk('public')->delete($media->file_path);
        $media->delete();

        return RoleRedirect::redirect('media', 'index')
            ->with('success', 'Media deleted successfully.');
    }
}
