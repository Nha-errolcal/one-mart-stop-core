<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException as ExceptionsTokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException as ExceptionsTokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
class ValidateToken
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 401);
            }
            auth()->setUser($user);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => $e->getMessage()
            ], 401);
        }

        return $next($request);
    }
}
