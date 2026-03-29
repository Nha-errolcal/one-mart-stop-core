<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'panhadev123@gmail.com')->first();
        $role = Role::where('code', 'YM-001')->first();

        if ($user && $role) {
            $user->roles()->sync([$role->id]);
        }
    }
}
