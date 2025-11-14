<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register your custom middleware aliases here
        // Keep backwards/alternate names in sync with app/Http/Kernel.php
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'checkrole' => \App\Http\Middleware\CheckRole::class,
        ]);

        // If needed, add or override other middleware/groups (e.g., if you've customized them)
        // $middleware->web(append: [
        //     \App\Http\Middleware\YourCustomMiddleware::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
