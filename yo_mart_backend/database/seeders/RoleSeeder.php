<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Admin',
                'code' => 'super_admin',
                'create_by' => 1,
            ],
            [
                'name' => 'Admin',
                'code' => 'admin',
                'create_by' => 1,
            ],
            [
                'name' => 'User',
                'code' => 'user',
                'create_by' => 1,
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['code' => $role['code']],
                $role
            );
        }
    }
}
