<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use Illuminate\Support\Facades\Log;
use App\Facades\ResponseData as FacadesResponseData;
use Illuminate\Http\Request;
class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $txtSearch = $request->input("query");

        $data = Permission::query()
            ->when($txtSearch, function ($q) use ($txtSearch) {
                $q->where("name", "like", "%{$txtSearch}%")
                    ->orWhere("code", "like", "%{$txtSearch}%")
                    ->orWhere("route_web", "like", "%{$txtSearch}%");
            })
            ->latest() // newest first (created_at DESC)
            ->get();

        return response()->json(
            FacadesResponseData::success($data, "Get all permission success")
        );
    }

    public function store(PermissionRequest $request)
    {
        try {
            $permission = Permission::create($request->validated());

            return response()->json(
                FacadesResponseData::created($permission, 'Permission created successfully')
            );
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
