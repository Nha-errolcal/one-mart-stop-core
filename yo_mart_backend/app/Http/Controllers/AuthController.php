<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Throwable;
use App\Facades\ResponseData as FacadesResponseData;

class AuthController extends Controller
{
    public function register(UserRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'username' => $validated['username'],
                'name' => $validated['name'] ?? null,
                'email' => $validated['email'] ?? null,
                'password' => bcrypt($validated['password']),
            ]);

            return response()->json([
                'user' => $user,
                'message' => 'Account created successfully.',
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
            ]);

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => 'required'
        ]);

        $login = $request->input('login');
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [$field => $login, 'password' => $request->password];

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = auth('api')->user()->load('roles.permissions');

        $roles = flattenRolesActions($user->roles);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'roles' => $roles
            ],
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }

    public function profile()
    {
        $user = auth('api')->user()->load('roles.permissions');

        return response()->json([
            'success' => true,
            'message' => 'Profile data',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'roles' => flattenRolesActions($user->roles)
            ]
        ]);
    }
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return response()->json([
            'access_token' => JWTAuth::refresh(),
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    public function syncRoles(Request $request, $userId)
    {
        $data = $request->validate([
            'role_ids' => 'required|array',
            'role_ids.*' => 'integer|exists:role,id',
        ]);

        $user = User::findOrFail($userId);
        $user->roles()->sync($data['role_ids']);

        return response()->json([
            'message' => 'Roles synced successfully',
            'data' => $user->load('roles')
        ]);
    }
}
