<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;  // Keep this if you have other Request uses, but not required for session()
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),  // Already uses helper
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        session()->regenerate();  // Changed to helper

        return redirect()->intended(auth()->user()->dashboard());
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        session()->invalidate();  // Changed to helper
        session()->regenerateToken();  // Changed to helper

        return redirect('/');
    }
}
