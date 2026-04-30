<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'View Dashboard', 'route_web' => '/', 'code' => 'dashboard.view'],

            ['name' => 'View Customers', 'route_web' => '/customer', 'code' => 'customer.view'],
            ['name' => 'Create Customer', 'route_web' => '/customer', 'code' => 'customer.create'],
            ['name' => 'Update Customer', 'route_web' => '/customer', 'code' => 'customer.update'],
            ['name' => 'Delete Customer', 'route_web' => '/customer', 'code' => 'customer.delete'],

            ['name' => 'View Products', 'route_web' => '/products', 'code' => 'product.view'],
            ['name' => 'Create Product', 'route_web' => '/products', 'code' => 'product.create'],
            ['name' => 'Update Product', 'route_web' => '/products', 'code' => 'product.update'],
            ['name' => 'Delete Product', 'route_web' => '/products', 'code' => 'product.delete'],

            ['name' => 'View Categories', 'route_web' => '/category', 'code' => 'category.view'],
            ['name' => 'Create Category', 'route_web' => '/category', 'code' => 'category.create'],
            ['name' => 'Update Category', 'route_web' => '/category', 'code' => 'category.update'],
            ['name' => 'Delete Category', 'route_web' => '/category', 'code' => 'category.delete'],

            ['name' => 'View Orders', 'route_web' => '/sale/order', 'code' => 'order.view'],
            ['name' => 'Create Order', 'route_web' => '/sale/order', 'code' => 'order.create'],
            ['name' => 'Update Order', 'route_web' => '/sale/order', 'code' => 'order.update'],
            ['name' => 'Delete Order', 'route_web' => '/sale/order', 'code' => 'order.delete'],

            ['name' => 'Access POS', 'route_web' => '/sale/pos', 'code' => 'sale.access'],

            ['name' => 'Customer Screen POS', 'route_web' => '/pos/customer_screen', 'code' => 'pos.customer_screen'],

            ['name' => 'View Users', 'route_web' => '/account/users', 'code' => 'user.view'],
            ['name' => 'View Roles', 'route_web' => '/account/roles', 'code' => 'role.view'],
            ['name' => 'Create Role', 'route_web' => '/account/roles', 'code' => 'role.create'],
            ['name' => 'Update Role', 'route_web' => '/account/roles', 'code' => 'role.update'],
            ['name' => 'Delete Role', 'route_web' => '/account/roles', 'code' => 'role.delete'],
            ['name' => 'View Profile', 'route_web' => '/account/profile', 'code' => 'profile.view'],
            ['name' => 'Edit Profile', 'route_web' => '/account/profile/edit', 'code' => 'profile.edit'],

            ['name' => 'View Permissions', 'route_web' => '/setting/permission', 'code' => 'permission.view'],
            ['name' => 'Create Permission', 'route_web' => '/setting/create/permission', 'code' => 'permission.create'],
            ['name' => 'Update Permission', 'route_web' => '/setting/update/permission', 'code' => 'permission.update'],
            ['name' => 'Delete Permission', 'route_web' => '/setting/delete/permission', 'code' => 'permission.delete'],
            ['name' => 'View System Info', 'route_web' => '/about/system', 'code' => 'about.system'],
            ['name' => 'View Team Info', 'route_web' => '/about/team', 'code' => 'about.team'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['code' => $permission['code']],
                [
                    'name' => $permission['name'],
                    'route_web' => $permission['route_web']
                ]
            );
        }
    }
}
