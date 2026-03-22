<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // ================= Dashboard =================
            [
                'name' => 'View Dashboard',
                'route_web' => '/',
                'code' => 'dashboard.view',
            ],

            // ================= Employees =================
            ['name' => 'View Employees', 'route_web' => '/employees', 'code' => 'employee.view'],
            ['name' => 'Create Employee', 'route_web' => '/employees', 'code' => 'employee.create'],
            ['name' => 'Update Employee', 'route_web' => '/employees', 'code' => 'employee.update'],
            ['name' => 'Delete Employee', 'route_web' => '/employees', 'code' => 'employee.delete'],

            // ================= Customers =================
            ['name' => 'View Customers', 'route_web' => '/customer', 'code' => 'customer.view'],
            ['name' => 'Create Customer', 'route_web' => '/customer', 'code' => 'customer.create'],
            ['name' => 'Update Customer', 'route_web' => '/customer', 'code' => 'customer.update'],
            ['name' => 'Delete Customer', 'route_web' => '/customer', 'code' => 'customer.delete'],

            // ================= Products =================
            ['name' => 'View Products', 'route_web' => '/product_detail', 'code' => 'product.view'],
            ['name' => 'Create Product', 'route_web' => '/product_detail', 'code' => 'product.create'],
            ['name' => 'Update Product', 'route_web' => '/product_detail', 'code' => 'product.update'],
            ['name' => 'Delete Product', 'route_web' => '/product_detail', 'code' => 'product.delete'],

            // ================= Categories =================
            ['name' => 'View Categories', 'route_web' => '/category', 'code' => 'category.view'],
            ['name' => 'Create Category', 'route_web' => '/category', 'code' => 'category.create'],
            ['name' => 'Update Category', 'route_web' => '/category', 'code' => 'category.update'],
            ['name' => 'Delete Category', 'route_web' => '/category', 'code' => 'category.delete'],

            // ================= Orders =================
            ['name' => 'View Orders', 'route_web' => '/order', 'code' => 'order.view'],
            ['name' => 'Create Order', 'route_web' => '/order', 'code' => 'order.create'],
            ['name' => 'Update Order', 'route_web' => '/order', 'code' => 'order.update'],
            ['name' => 'Delete Order', 'route_web' => '/order', 'code' => 'order.delete'],

            // ================= POS Sale =================
            ['name' => 'Access Sale POS', 'route_web' => '/sale', 'code' => 'sale.access'],

            // ['name' => 'View Roles',        'route_web' => '/role',        'code' => 'role.view'],
            // ['name' => 'View Permissions',  'route_web' => '/permission',  'code' => 'permission.view'],
            // ['name' => 'View Payments',     'route_web' => '/payments',    'code' => 'payment.view'],
            // ['name' => 'View Order Detail', 'route_web' => '/order_detail','code' => 'order_detail.view'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['code' => $permission['code']],
                [
                    'name' => $permission['name'],
                    'route_web' => $permission['route_web'],
                ]
            );
        }
    }
}
