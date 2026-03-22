<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ReportController extends Controller
{

    /**
     * close store by data by user
     * @return \Illuminate\Http\JsonResponse
     */
    public function closeDay(Request $request)
    {
        try {

            $date = $request->date ?? date(format: 'Y-m-d');

            $summary = Order::whereDate('created_at', $date)
                ->selectRaw('COUNT(*) as total_orders, SUM(paid_amount) as total_sales')
                ->first();

            $items = DB::table('order_detail')
                ->join('order', 'order.id', '=', 'order_detail.order_id')
                ->whereDate('order.created_at', $date)
                ->selectRaw('SUM(qty) as total_qty, SUM(discount) as total_discount')
                ->first();

            $payments = Order::whereDate('created_at', $date)
                ->select('payment_method', DB::raw('COUNT(*) as total_orders'), DB::raw('SUM(paid_amount) as total_amount'))
                ->groupBy('payment_method')
                ->get();

            $products = DB::table('order_detail')
                ->join('product', 'product.id', '=', 'order_detail.product_id')
                ->join('order', 'order.id', '=', 'order_detail.order_id')
                ->whereDate('order.created_at', $date)
                ->select(
                    'product.name',
                    'product.image',
                    DB::raw('SUM(order_detail.qty) as total_qty'),
                    DB::raw('SUM(order_detail.total) as total_sales')
                )
                ->groupBy('product.name', 'product.image')
                ->orderByDesc('total_qty')
                ->limit(5)
                ->get();

            $cashier = Order::from('order as o')
                ->join('users as u', 'u.id', '=', 'o.user_id')
                ->whereDate('o.created_at', $date)
                ->select(
                    'u.name',
                    DB::raw('COUNT(o.id) as total_orders'),
                    DB::raw('SUM(o.paid_amount) as total_sales')
                )
                ->groupBy('u.name')
                ->get();

            return response()->json([
                'date' => $date,
                'summary' => $summary,
                'items' => $items,
                'payment_summary' => $payments,
                'top_products' => $products,
                'cashier_sales' => $cashier
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to generate report.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function monthlySalesReport(Request $request)
    {
        try {

            $year = $request->year ?? date('Y');

            $sales = DB::table('order')
                ->select(
                    DB::raw('EXTRACT(MONTH FROM created_at) as month'),
                    DB::raw('COUNT(id) as total_orders'),
                    DB::raw('SUM(paid_amount) as total_sales')
                )
                ->whereYear('created_at', $year)
                ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
                ->orderBy('month')
                ->get();

            return response()->json([
                'year' => $year,
                'monthly_sales' => $sales
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to generate report.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
