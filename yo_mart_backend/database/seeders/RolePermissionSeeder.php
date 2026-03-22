<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::where('code', 'ADMIN')->first();

        if (!$role)
            return;

        $permissionIds = Permission::pluck('id')->toArray();

        $role->permissions()->sync($permissionIds);
    }
}
