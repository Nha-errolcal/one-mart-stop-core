<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'panhadev123@gmail.com')->first();
        $role = Role::where('code', 'super_admin')->first();

        if ($user && $role) {
            $user->roles()->sync([$role->id]);
        }
    }
}
