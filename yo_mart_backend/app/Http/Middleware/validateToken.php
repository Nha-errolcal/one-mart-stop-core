<?php

namespace App\Http\Middleware;

use Closure;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException as ExceptionsTokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException as ExceptionsTokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
class ValidateToken
{
    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (ExceptionsTokenExpiredException $e) {
            return response()->json(['message' => 'Token expired'], 401);
        } catch (ExceptionsTokenInvalidException $e) {
            return response()->json(['message' => 'Token invalid'], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Token not found'], 401);
        }

        return $next($request);
    }
}
