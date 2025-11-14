<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TrimString
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $request->merge(array_map(function ($value) {
            return is_string($value) ? trim($value) : $value;
        }, $request->all()));

        return $next($request);
    }
}
