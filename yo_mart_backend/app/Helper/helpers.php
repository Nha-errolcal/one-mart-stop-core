<?php

use Illuminate\Support\Collection;
use App\Helpers\ResponseData;
use Illuminate\Support\Facades\Log;

if (!function_exists('apiResponse')) {
    function apiResponse($data = null, $message = "Success")
    {
        $response = new ResponseData();
        return $response->success($data, $message);
    }
}

if (!function_exists('apiError')) {
    function apiError($message = "Error", $error = null)
    {
        $response = new ResponseData();
        return $response->error($message, $error);
    }
}



if (!function_exists('flattenRolesActions')) {
    function flattenRolesActions(Collection $roles): Collection
    {
        return $roles->map(function ($role) {
            $permissions = [];

            foreach ($role->permissions as $perm) {
                $code = $perm->name;
                if (!isset($permissions[$code])) {
                    $permissions[$code] = [
                        'action' => []
                    ];
                }

                $permissions[$code]['action'][] = [
                    'id' => $perm->id,
                    "name" => $perm->name,
                    "web_route" => $perm->route_web,
                    "app_route" => $perm->route_app,
                    "code" => $perm->code,
                    'allowed' => (bool) ($perm->pivot->allowed ?? false),
                    'action' => $perm->pivot->action ?? ''
                ];
            }

            return [
                'id' => $role->id,
                'name' => $role->name,
                'code' => $role->code,
                'permissions' => $permissions
            ];
        });
    }
}
