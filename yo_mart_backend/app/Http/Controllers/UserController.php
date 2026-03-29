<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Facades\ResponseData as FacadesResponseData;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Throwable;

class UserController extends Controller
{
    public function index()
    {
        try {
            $currentUserId = auth()->id();

            $users = User::where('id', '!=', $currentUserId)
                ->orderBy('id', 'DESC')
                ->get();

            return response()->json(
                FacadesResponseData::success($users, "Get all users"),
                200
            );

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function viewOnly($id, Request $request)
    {
        try {
            // Get user with roles & permissions
            $user = User::with('roles.permissions')->findOrFail($id);

            // flatten roles + permissions
            $flattened = $user->roles->flatMap(function ($role) use ($user) {

                // if role has no permissions
                if ($role->permissions->isEmpty()) {
                    return [
                        [
                            'user_id' => $user->id,
                            'username' => $user->username,
                            'name' => $user->name,
                            'email' => $user->email,

                            'role_id' => $role->id,
                            'role_name' => $role->name,
                            'role_code' => $role->code,

                            'permission_id' => null,
                            'permission_name' => null,
                            'permission_code' => null,
                        ]
                    ];
                }

                // if role has permissions
                return $role->permissions->map(function ($permission) use ($user, $role) {
                    return [
                        'user_id' => $user->id,
                        'username' => $user->username,
                        'name' => $user->name,
                        'email' => $user->email,

                        'role_id' => $role->id,
                        'role_name' => $role->name,
                        'role_code' => $role->code,

                        'permission_id' => $permission->id,
                        'permission_name' => $permission->name,
                        'permission_code' => $permission->code,
                    ];
                });
            });

            return response()->json(
                FacadesResponseData::success(
                    $flattened->values(),
                    "Get user with roles & permissions"
                ),
                status: 200
            );

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validatedData = $request->validate([
                'username' => 'required|string|max:255|unique:users,username,' . $user->id,
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:6|confirmed', // password confirmation
            ]);

            if (!empty($validatedData['password'])) {
                $validatedData['password'] = bcrypt($validatedData['password']);
            } else {
                unset($validatedData['password']);
            }

            // Update user
            $user->update($validatedData);

            return response()->json(
                FacadesResponseData::success($user, "User updated successfully"),
                200
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function deleteUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'password' => 'required|string|min:6',
            ]);

            $currentUser = auth()->user();

            if (!Hash::check($request->input('password'), $currentUser->password)) {
                return response()->json(
                    [
                        'data' => [
                            "success" => false,
                            "status" => 400,
                            "message" => "Invalid password",
                            'data' => null,
                            'timestamp' => now(),
                        ],
                    ]
                );
            }

            if ($currentUser->id === $user->id) {
                return response()->json(
                    FacadesResponseData::error("Error", "You cannot delete your own account"),
                    400
                );
            }

            $user->delete();

            return response()->json(
                FacadesResponseData::success(null, "User deleted successfully"),
                200
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(

                // FacadesResponseData::error("Validation Error", $e->errors(), 422),
                // 422
                [
                    'data' => [
                        "success" => false,
                        "status" => 422,
                        "message" => "Validation Error",
                        'data' => null,
                        'error' => $e->errors(),
                        'timestamp' => now(),
                    ],
                ],
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage(), 500),
                500
            );
        }
    }
}
