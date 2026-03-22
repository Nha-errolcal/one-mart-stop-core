<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = auth('api')->user();
        if (!$user) {
            return response()->json([
                "message" => "Unauthenticated"
            ], 401);
        }


        if (!$user->hasPermission($permission)) {
            return response()->json([
                "message" => 'Forbidden: You do not have permission',
                'required_permission' => $permission
            ], 403);
        }
        return $next($request);
    }
}
