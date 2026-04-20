<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $role = Role::firstOrCreate(
            ['code' => 'super_admin'],
            [
                'name' => 'Super Admin',
                'create_by' => 1,
            ]
        );

        // 2. Create user
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
    }
}
