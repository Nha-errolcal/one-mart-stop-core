<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleResuest;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Facades\ResponseData as FacadesResponseData;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::with('permissions')->get();

            return response()->json([
                'success' => true,
                'data' => flattenRolesActions($roles)
            ]);
        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve roles.'
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


    public function addPermissions(Request $request, $roleId)
    {
        $data = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.permission_id' => 'required|integer|exists:permissions,id',
            'permissions.*.action' => 'required|string',
            'permissions.*.allowed' => 'required|boolean',
        ]);

        $role = Role::findOrFail($roleId);

        foreach ($data['permissions'] as $perm) {

            $exists = DB::table('permission_role')
                ->where('role_id', $roleId)
                ->where('permission_id', $perm['permission_id'])
                ->where('action', $perm['action'])
                ->first();

            if ($exists) {
                DB::table('permission_role')
                    ->where('role_id', $roleId)
                    ->where('permission_id', $perm['permission_id'])
                    ->where('action', $perm['action'])
                    ->update([
                        'allowed' => $perm['allowed'],
                        'updated_at' => now(),
                    ]);
            } else {
                DB::table('permission_role')->insert([
                    'role_id' => $roleId,
                    'permission_id' => $perm['permission_id'],
                    'action' => $perm['action'],
                    'allowed' => $perm['allowed'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return response()->json(
            FacadesResponseData::created(
                $role->load('permissions'),
                "Permissions added successfully"
            )
        );
    }


    public function updatePermissions(Request $request, $roleId)
    {
        $data = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.permission_id' => 'required|integer|exists:permissions,id',
            'permissions.*.action' => 'required|string',
            'permissions.*.allowed' => 'required|boolean',
        ]);

        $role = Role::findOrFail($roleId);

        // Step 1: Remove all existing permissions for this role
        $role->permissions()->detach();

        // Step 2: Attach new permissions
        $attachData = [];
        foreach ($data['permissions'] as $perm) {
            $attachData[$perm['permission_id'] . '_' . $perm['action']] = [
                'action' => $perm['action'],
                'allowed' => $perm['allowed'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach ($attachData as $key => $pivot) {
            $role->permissions()->attach($pivot['permission_id'] ?? explode('_', $key)[0], $pivot);
        }

        return response()->json([
            'message' => 'Permissions updated successfully (all replaced)',
            'data' => $role->load('permissions')
        ]);
    }

    public function deletePermissions(Request $request, $roleId)
    {
        $data = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.permission_id' => 'required|integer|exists:permissions,id',
            'permissions.*.action' => 'required|string',
        ]);

        $role = Role::findOrFail($roleId);

        foreach ($data['permissions'] as $perm) {
            $role->permissions()->detach($perm['permission_id'], ['action' => $perm['action']]);
        }

        return response()->json([
            'message' => 'Selected permissions removed successfully',
            'data' => $role->load('permissions')
        ]);
    }
    public function syncPermissions(Request $request, $roleId)
    {
        $data = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.permission_id' => 'required|integer|exists:permissions,id',
            'permissions.*.action' => 'required|string',
            'permissions.*.allowed' => 'required|boolean',
        ]);

        $role = Role::findOrFail($roleId);

        // Step 1: Prepare new pivot data
        $syncData = [];
        foreach ($data['permissions'] as $perm) {
            $syncData[$perm['permission_id']][] = [
                'action' => $perm['action'],
                'allowed' => $perm['allowed'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Step 2: Remove old actions not included in request
        $existing = $role->permissions()->get();
        foreach ($existing as $permission) {
            foreach ($permission->pivot->action ? [$permission->pivot->action] : [] as $action) {
                $found = false;
                if (isset($syncData[$permission->id])) {
                    foreach ($syncData[$permission->id] as $newPivot) {
                        if ($newPivot['action'] === $action) {
                            $found = true;
                            break;
                        }
                    }
                }
                if (!$found) {
                    $role->permissions()
                        ->wherePivot('action', $action)
                        ->detach($permission->id);
                }
            }
        }

        // Step 3: Add or update all provided actions
        foreach ($syncData as $permissionId => $actions) {
            foreach ($actions as $pivotData) {
                $existing = $role->permissions()
                    ->where('permission_id', $permissionId)
                    ->wherePivot('action', $pivotData['action'])
                    ->first();

                if ($existing) {
                    $role->permissions()->updateExistingPivot($permissionId, $pivotData);
                } else {
                    $role->permissions()->attach($permissionId, $pivotData);
                }
            }
        }

        return response()->json([
            'message' => 'Permissions synced successfully (add-update-remove)',
            'data' => $role->load('permissions')
        ]);
    }
}
