<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('code', 'super_admin')->first();

        if (!$role)
            return;

        $permissionIds = Permission::pluck('id')->toArray();

        $role->permissions()->sync($permissionIds);
    }
}
