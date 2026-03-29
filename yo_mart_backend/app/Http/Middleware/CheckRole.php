<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $userRoles = $user->roles->pluck('name')->toArray(); // get array of role names
        // access full permissions for super admin
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        $allowed = array_intersect($roles, $userRoles);
        if (empty($allowed)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}
