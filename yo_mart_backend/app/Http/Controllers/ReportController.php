<?php

namespace App\Http\Controllers;

use App\Facades\ResponseData as FacadesResponseData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use Throwable;

class ReportController extends Controller
{
    /**
     * Close day report
     */
    public function closeDay(Request $request)
    {
        try {
            $date = $request->date ?? date('Y-m-d');
            $userId = $request->user_id;

            $orderQuery = Order::whereDate('created_at', $date);

            if ($userId) {
                $orderQuery->where('user_id', $userId);
            }

            $summary = (clone $orderQuery)
                ->selectRaw('COUNT(*) as total_orders, SUM(paid_amount) as total_sales')
                ->first();

            $items = DB::table('order_detail')
                ->join('order', 'order.id', '=', 'order_detail.order_id')
                ->whereDate('order.created_at', $date)
                ->when($userId, function ($q) use ($userId) {
                    $q->where('order.user_id', $userId);
                })
                ->selectRaw('SUM(qty) as total_qty, SUM(discount) as total_discount')
                ->first();

            $payments = (clone $orderQuery)
                ->select(
                    'payment_method',
                    DB::raw('COUNT(*) as total_orders'),
                    DB::raw('SUM(paid_amount) as total_amount')
                )
                ->groupBy('payment_method')
                ->get();

            $products = DB::table('order_detail')
                ->join('product', 'product.id', '=', 'order_detail.product_id')
                ->join('order', 'order.id', '=', 'order_detail.order_id')
                ->whereDate('order.created_at', $date)
                ->when($userId, function ($q) use ($userId) {
                    $q->where('order.user_id', $userId);
                })
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

            $cashier = DB::table('order as o')
                ->join('users as u', 'u.id', '=', 'o.user_id')
                ->whereDate('o.created_at', $date)
                ->when($userId, function ($q) use ($userId) {
                    $q->where('o.user_id', $userId);
                })
                ->select(
                    'u.name',
                    DB::raw('COUNT(o.id) as total_orders'),
                    DB::raw('SUM(o.paid_amount) as total_sales')
                )
                ->groupBy('u.name')
                ->get();

            $data = [
                'date' => $date,
                'user_id' => $userId,
                'summary' => $summary,
                'items' => $items,
                'payment_summary' => $payments,
                'top_products' => $products,
                'cashier_sales' => $cashier
            ];

            return response()->json(
                FacadesResponseData::success($data, "Close day report")
            );

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error($e, "Error"),
                500
            );
        }
    }

    /**
     * Monthly sales report
     */
    public function monthlySalesReport(Request $request)
    {
        try {
            $year = $request->year ?? date('Y');
            $userId = $request->user_id;

            $query = DB::table('order')
                ->whereYear('created_at', $year);

            if ($userId) {
                $query->where('user_id', $userId);
            }

            $sales = $query
                ->select(
                    DB::raw('EXTRACT(MONTH FROM created_at) as month'),
                    DB::raw('COUNT(id) as total_orders'),
                    DB::raw('SUM(paid_amount) as total_sales')
                )
                ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
                ->orderBy('month')
                ->get();

            return response()->json(
                FacadesResponseData::success($sales, "Monthly sales report")
            );

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error($e, "Error"),
                500
            );
        }
    }

    /**
     * Today report
     */
    public function orderReportToday(Request $request)
    {
        try {
            $userId = $request->user_id;

            $baseQuery = DB::table('order');

            if ($userId) {
                $baseQuery->where('user_id', $userId);
            }

            // total orders today
            $saleToday = (clone $baseQuery)
                ->selectRaw('COUNT(id) as total_orders')
                ->whereDate('created_at', today())
                ->first();

            // total customer
            $customerOrderToday = (clone $baseQuery)
                ->selectRaw('COUNT(customer_id) as customer_order_today')
                ->whereDate('created_at', today())
                ->first();

            // growth today
            $today = (clone $baseQuery)
                ->whereDate('created_at', today())
                ->sum("paid_amount");

            $yesterday = (clone $baseQuery)
                ->whereDate('created_at', today()->subDay())
                ->sum('paid_amount');

            $growthToday = $yesterday > 0
                ? round((($today - $yesterday) / $yesterday) * 100, 2)
                : 0;

            // growth monthly
            $currentMonth = (clone $baseQuery)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('paid_amount');

            $lastMonth = (clone $baseQuery)
                ->whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->sum('paid_amount');

            $growthMonthly = $lastMonth > 0
                ? round((($currentMonth - $lastMonth) / $lastMonth) * 100, 2)
                : 0;

            // weekly sales
            $weeklySales = (clone $baseQuery)
                ->selectRaw('DATE(created_at) as date, SUM(paid_amount) as total_sales')
                ->whereDate('created_at', '>=', now()->subDays(6))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get();

            // top products
            $topProductSale = DB::table("order_detail AS od")
                ->join('product AS p', 'od.product_id', '=', 'p.id')
                ->join('order AS o', 'o.id', '=', 'od.order_id')
                ->when($userId, function ($q) use ($userId) {
                    $q->where('o.user_id', $userId);
                })
                ->select(
                    'p.id',
                    'p.name AS product_name',
                    DB::raw('SUM(od.qty) AS total_sold'),
                    DB::raw('SUM(od.price * od.qty) AS total_revenue')
                )
                ->groupBy('p.id', 'p.name')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get();

            $data = [
                "date" => date('Y-m-d'),
                "user_id" => $userId,
                "total_order_today" => $saleToday->total_orders ?? 0,
                "customer_order_today" => $customerOrderToday->customer_order_today ?? 0,
                "growth_today" => $growthToday,
                "growth_monthly" => $growthMonthly,
                "weekly_sales" => $weeklySales,
                "top_products" => $topProductSale
            ];

            return response()->json(
                FacadesResponseData::success($data, "Today report")
            );

        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }
}
