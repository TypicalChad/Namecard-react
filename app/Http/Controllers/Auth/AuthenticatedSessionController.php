<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        // Call the authenticate method from LoginRequest
        $request->authenticate(); // ✅ Throws ValidationException on failure

        // Regenerate session if login is successful
        $request->session()->regenerate();

        return redirect()->intended(Auth::user()->dashboard());
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        session()->invalidate();
        session()->regenerateToken();

        return redirect('/');
    }
}
