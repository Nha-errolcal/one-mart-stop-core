<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use Illuminate\Support\Facades\Log;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Permission::all()
        ], 200);
    }

    public function store(PermissionRequest $request)
    {
        try {
            $permission = Permission::create($request->validated());

            return response()->json([
                'message' => 'Permission created successfully.',
                'data' => $permission
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create permission.'], 500);
        }
    }

    public function show($id)
    {
        $permission = Permission::find($id);
        if (!$permission) {
            return response()->json(['message' => 'Permission not found'], 404);
        }
        return response()->json(['data' => $permission], 200);
    }

    public function update(PermissionRequest $request, $id)
    {
        try {
            $permission = Permission::find($id);
            if (!$permission) {
                return response()->json(['message' => 'Permission not found'], 404);
            }

            $permission->update($request->validated());

            return response()->json([
                'message' => 'Permission updated successfully.',
                'data' => $permission
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update permission: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Failed to update permission.'], 500);
        }
    }

    public function destroy($id)
    {
        $permission = Permission::find($id);
        if (!$permission) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        $permission->delete();
        return response()->json(['message' => 'Permission deleted successfully.'], 200);
    }
}
