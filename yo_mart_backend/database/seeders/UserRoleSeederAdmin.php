<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserRoleSeederAdmin extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // 1. Create Role (or get existing)
        $superAdminRole = Role::firstOrCreate(
            ['code' => 'super_admin'],
            [
                'name' => 'Super Admin',
                'create_by' => 1,
            ]
        );

        // 2. Create User (or get existing)
        $user = User::firstOrCreate(
            ['email' => 'super_admin888@gmail.com'],
            [
                'username' => 'super_admin',
                'name' => 'Super Admin',
                'password' => Hash::make('admin@123'),
                'admin_id' => null,
                'create_by' => 1,
            ]
        );

        $user->roles()->syncWithoutDetaching([
            $superAdminRole->id
        ]);

    }
}
