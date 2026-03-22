<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Employees;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $customer = Customer::all();
            $employees = Employees::all();
            $order = Order::all();
            $product = Product::all();
            $category = Category::all();

            return response()->json([
                'customer' => $customer,
                'employees' => $employees,
                'order' => $order,
                'product' => $product,
                'category' => $category,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to order.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
