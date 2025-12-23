<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\{
    DashboardController,
    RoleController,
    UserController,
    DepartmentController,
    CompController,
    NameCardController,
    ProfileController
};
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Login page (GET)
Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');

// Login submit (POST)
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});


// Force logout
Route::get('/force-logout', function () {
    Auth::logout();
    session()->invalidate();
    session()->regenerateToken();
    return redirect('/login');
});

// Forgot password page
Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->name('password.request');

// Login redirect
Route::get('/', fn() => redirect()->route('login'));

// Authenticated & verified routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        $user->loadMissing('role');
        $roleName = strtolower($user->role->name ?? '');
        $role = str_contains($roleName, 'admin') ? 'admin' : 'user';
        $currentPath = request()->path();
        $targetPath = "{$role}/dashboard";

        if ($currentPath === $targetPath) {
            return Inertia::render('Dashboard');
        }

        return redirect()->route("{$role}.dashboard");
    })->name('dashboard');
});

// Allowed roles
$roles = ['admin', 'user'];

foreach ($roles as $role) {
    Route::prefix($role)
        ->name("$role.")
        ->middleware(['auth', "checkrole:$role"])
        ->group(function () use ($role) {
            // Dashboard
            Route::get('dashboard', [DashboardController::class, 'index'])
                ->name('dashboard');

            // Common routes for normal users + admin
            Route::resource('namecards', NameCardController::class);
            Route::resource('departments', DepartmentController::class);

            // Admin-only routes
            if ($role === 'admin') {
                Route::resources([
                    'roles' => RoleController::class,
                    'users' => UserController::class,
                    'companies' => CompController::class,
                    //'media' => MediaController::class,
                ]);
            }
        });
}

// Public Profile
Route::get('/profile/{uid}', [NameCardController::class, 'showByUid'])
    ->whereUuid('uid')
    ->name('namecards.showByUid');

require __DIR__ . '/auth.php';
