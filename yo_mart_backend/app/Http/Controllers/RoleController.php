<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleResuest;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    public function index()
    {
        try {
            $getAll = Role::all();

            return response()->json([
                'getAll' => $getAll
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    public function store(RoleResuest $roleRequest)
    {
        try {
            $newCode = $this->newRoleCode();

            if (!$newCode) {
                return response()->json([
                    'message' => 'Failed to generate role code.',
                ], 500);
            }

            // Validate the rest of the request data
            $validated = $roleRequest->validated();
            $validated['code'] = $newCode;
            $validated['create_by'] = Auth::user()->name;

            $create = Role::create($validated);

            return response()->json([
                'message' => 'Role created successfully.',
                'data' => $create
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create role.'
            ], 500);
        }
    }



    public function update(RoleResuest $roleResuest, $id)
    {
        try {
            $validated = $roleResuest->validated();
            $role = Role::find($id);

            if (!$role) {
                return response()->json([
                    'message' => 'Role not found'
                ], 404);
            }
            $role->update($validated);

            return response()->json([
                'message' => 'Role updated successfully',
                'role' => $role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response()->json([
                    'message' => 'Role not found'
                ], 404);
            }


            $role->delete();

            return response()->json([
                'message' => 'Role deleted successfully.',
                'data' => $role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response()->json(['message' => 'Role not found'], 404);
            }


            return response()->json([
                'message' => 'Customer retrieved successfully.',
                'getOne' => $role
            ], 200);


        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    protected function newRoleCode(): ?string
    {
        try {
            $prefix = 'YM-';
            $digits = 3;         // 001,002,003...

            $max = Role::query()
                ->where('code', 'like', $prefix . '%')
                ->selectRaw("MAX(CAST(substring(code from '[0-9]+$') AS integer)) as max_code")
                ->value('max_code');

            $next = ((int) $max) + 1;

            return $prefix . str_pad((string) $next, $digits, '0', STR_PAD_LEFT);
        } catch (\Throwable $e) {
            return null;
        }
    }


    public function syncPermissions(Request $request, $roleId)
    {
        $data = $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::findOrFail($roleId);
        $role->permissions()->sync($data['permission_ids']);

        return response()->json([
            'message' => 'Permissions assigned to role',
            'data' => $role->load('permissions')
        ]);
    }


}
