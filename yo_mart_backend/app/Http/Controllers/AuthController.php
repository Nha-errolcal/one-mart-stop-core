<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Throwable;
use App\Facades\ResponseData as FacadesResponseData;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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
                'roles' => flattenRolesActions($user->roles),
                'store_info' => $user->admin ? [
                    'id' => $user->admin->id,
                    'name' => $user->admin->name,
                    'store_no' => $user->admin->store_no,
                    'company_name' => $user->admin->company_name,
                    'province' => $user->admin->province,
                    'district' => $user->admin->district,
                    'village' => $user->admin->village,
                    'street' => $user->admin->street,
                    'house_no' => $user->admin->house_no,
                    'address_note' => $user->admin->address_note,
                    'branch' => $user->admin->branch,
                    'logo' => $user->admin->logo ?? null,
                    'created_at' => $user->admin->created_at->toDateTimeString(),
                ] : null
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

        $user = User::find($userId);

        if (!$user) {
            return response()->json(
                FacadesResponseData::error(
                    'User not found',
                    "User not found",
                    404
                )
            );
        }

        $user->roles()->syncWithoutDetaching($data['role_ids']);

        return response()->json(
            FacadesResponseData::created(
                $user->load('roles'),
                'Roles synced successfully'
            )
        );
    }


    /**
     * admins
     */
    public function createAdmin(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:admins,email',
                'phone' => 'nullable|string|max:20',
                'province' => 'nullable|string|max:255',
                'district' => 'nullable|string|max:255',
                'village' => 'nullable|string|max:255',
                'street' => 'nullable|string|max:255',
                'house_no' => 'nullable|string|max:255',
                'address_note' => 'nullable|string|max:255',
                'branch' => 'nullable|string|max:255',
                'company_name' => 'nullable|string|max:255',
                'logo' => 'nullable|string|max:255',
                'status' => 'nullable|integer',
            ]);

            $admin = DB::transaction(function () use ($validated) {
                $validated['store_no'] = 'STORE-' . str_pad(Admin::max('id') + 1, 3, '0', STR_PAD_LEFT);
                $validated['created_by'] = Auth::user()->id ?? null;
                return Admin::create($validated);
            });

            return response()->json(
                FacadesResponseData::success($admin, "Admin account created successfully.")
            );

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function listStores()
    {
        try {
            $stores = Admin::whereNotNull('store_no')->get();
            return response()->json(
                FacadesResponseData::success($stores, "Store list")
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function updateStoreAdmin(Request $request, $adminId)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:admins,email,' . $adminId,
                'phone' => 'nullable|string|max:20',
                'province' => 'nullable|string|max:255',
                'district' => 'nullable|string|max:255',
                'village' => 'nullable|string|max:255',
                'street' => 'nullable|string|max:255',
                'house_no' => 'nullable|string|max:255',
                'address_note' => 'nullable|string|max:255',
                'branch' => 'nullable|string|max:255',
                'company_name' => 'nullable|string|max:255',
                'logo' => 'nullable|string|max:255',
                'status' => 'nullable|integer',
            ]);

            $admin = Admin::findOrFail($adminId);
            $admin->update($validated);

            return response()->json(
                FacadesResponseData::success($admin, "Admin account updated successfully.")
            );

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function deleteStoreAdmin($adminId)
    {
        try {
            $admin = Admin::findOrFail($adminId);
            if ($admin->users()->exists()) {
                return response()->json(
                    FacadesResponseData::error("Error", "Cannot delete admin with associated users."),
                    400
                );
            }
            $admin->delete();

            return response()->json(
                FacadesResponseData::success(null, "Admin account deleted successfully.")
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function listOneStore($adminId)
    {
        try {
            $admin = Admin::findOrFail($adminId);
            if ($admin->store_no === null) {
                return response()->json(
                    FacadesResponseData::error("Error", "Admin does not have store information."),
                    400
                );
            }

            return response()->json(
                FacadesResponseData::success($admin, "Store information")
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }


    public function findAccount(Request $request)
    {
        try {
            $query = $request->input('query');

            if (!$query) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Please provide a username or email to search.'
                ], 400);
            }

            $users = User::where('username', 'like', "%$query%")
                ->orWhere('email', 'like', "%$query%")
                ->get();

            if ($users->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $users
            ]);

        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function findAccountForgetAccount(Request $request)
    {
        try {
            // Get search input
            $txt_find_account = $request->input('query'); // 'query' is the input field name

            if (!$txt_find_account) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Please provide a username or email to search.'
                ], 400);
            }

            $user = User::where('username', $txt_find_account)
                ->orWhere('email', $txt_find_account)
                ->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $user
            ]);

        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {

    }


    public function changePassword(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'new_password' => 'required|min:6|confirmed', // expects `new_password_confirmation`
        ]);

        try {
            $user = User::find($request->user_id);
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password changed successfully'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // public function updateProfile
}
