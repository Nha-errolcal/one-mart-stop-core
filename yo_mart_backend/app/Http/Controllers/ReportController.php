<?php

namespace App\Http\Controllers;

use App\Facades\ResponseData as FacadesResponseData;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Throwable;
use ResponseData;


class ReportController extends Controller
{
    /**
     * Close day report
     */
    public function closeDay(Request $request)
    {
        try {
            $date = $request->date ?? date('Y-m-d');

            $summary = Order::whereDate('created_at', $date)
                ->selectRaw('COUNT(*) as total_orders, SUM(paid_amount) as total_sales')
                ->first();

            $items = DB::table('order_detail')
                ->join('order', 'order.id', '=', 'order_detail.order_id')
                ->whereDate('order.created_at', $date)
                ->selectRaw('SUM(qty) as total_qty, SUM(discount) as total_discount')
                ->first();

            $payments = Order::whereDate('created_at', $date)
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
                ->select(
                    'u.name',
                    DB::raw('COUNT(o.id) as total_orders'),
                    DB::raw('SUM(o.paid_amount) as total_sales')
                )
                ->groupBy('u.name')
                ->get();

            $data = [
                'date' => $date,
                'summary' => $summary,
                'items' => $items,
                'payment_summary' => $payments,
                'top_products' => $products,
                'cashier_sales' => $cashier
            ];

            return response()->json(FacadesResponseData::success($data, "get successfully"));

        } catch (Throwable $e) {
            return response()->json(FacadesResponseData::error($e, "error"));
        }
    }

    /**
     * Monthly sales report
     */
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
            return response()->json(FacadesResponseData::success($sales, "Monthly sales report"));

        } catch (Throwable $e) {
            return response()->json(FacadesResponseData::error($e, "error"));

        }
    }

    /**
     * Today report
     */
    public function orderReportToday()
    {
        try {

            $saleToday = DB::table('order')
                ->selectRaw('COUNT(id) as total_orders')
                ->whereDate('created_at', today())
                ->first();

            $customerOrderToday = DB::table('order')
                ->selectRaw('COUNT(customer_id) as customer_order_today')
                ->whereDate('created_at', today())
                ->first();

            // daily growth
            $today = DB::table("order")
                ->whereDate('created_at', today())
                ->sum("paid_amount");

            $yesterday = DB::table('order')
                ->whereDate('created_at', today()->subDay())
                ->sum('paid_amount');

            $growthToday = $yesterday > 0
                ? round((($today - $yesterday) / $yesterday) * 100, 2)
                : 0;
            $yesterday = DB::table('order')
                ->whereDate('created_at', today()->subDay())
                ->sum('paid_amount');

            $dayBeforeYesterday = DB::table('order')
                ->whereDate('created_at', today()->subDays(2))
                ->sum('paid_amount');
            $yesterdayGrowth = $dayBeforeYesterday > 0
                ? round((($yesterday - $dayBeforeYesterday) / $dayBeforeYesterday) * 100, 2)
                : 0;

            // monthly growth
            $currentMonth = DB::table('order')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('paid_amount');

            $lastMonth = DB::table('order')
                ->whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->sum('paid_amount');

            $growthMonthly = $lastMonth > 0
                ? round((($currentMonth - $lastMonth) / $lastMonth) * 100, 2)
                : 0;

            //monthly_sales use for chart
            $sales = DB::table('order')
                ->select(
                    DB::raw('EXTRACT(MONTH FROM created_at) as month'),
                    DB::raw('SUM(paid_amount) as total_sales')
                )
                ->whereYear('created_at', now()->year)
                ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
                ->orderBy('month')
                ->get();

            $weeklySales = DB::table('order')
                ->selectRaw('DATE(created_at) as date, SUM(paid_amount) as total_sales')
                ->whereDate('created_at', '>=', now()->subDays(6))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get();
            $monthlySales = DB::table('order')
                ->selectRaw('DATE(created_at) as date, SUM(paid_amount) as total_sales')
                ->whereDate('created_at', '>=', now()->subDays(29))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get();

            $topProductSale = DB::table("order_detail AS od")
                ->join('product AS p', 'od.product_id', '=', 'p.id')
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
                "total_order_today" => $saleToday->total_orders ?? 0,
                "customer_order_today" => $customerOrderToday->customer_order_today ?? 0,
                "growth_today" => $growthToday,
                "growth_monthly" => $growthMonthly,
                "weekly_sales" => $weeklySales,
                "monthly_sales" => $monthlySales,
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
