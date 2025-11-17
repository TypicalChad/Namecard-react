<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot()
    {
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => Auth::user() ? [
                        'id' => Auth::id(),
                        'name' => Auth::user()->name,
                        'email' => Auth::user()->role->email,
                        'role_id' => Auth::user()->role_id,
                        'role' => Auth::user()->role ? [
                            'name' => Auth::user()->role->name,
                            'display_name' => Auth::user()->role->display_name,
                        ] : null,
                    ] : null,
                ];
            },
        ]);
    }

    protected $policies = [
        \App\Models\NameCard::class => \App\Policies\NameCardPolicy::class,
    ];
}
