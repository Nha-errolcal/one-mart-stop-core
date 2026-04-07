<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderDetailRequest;
use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $txt_search = request()->input('search');

            $order = DB::table(DB::raw('"order" as r'))
                ->leftJoin('customer as cus', 'r.customer_id', '=', 'cus.id')
                ->leftJoin('users as u', 'r.user_id', '=', 'u.id')
                ->select('r.*', 'cus.name as customer_name', 'u.name as user_name')
                ->when($txt_search, function ($query) use ($txt_search) {
                    $query->where(function ($q) use ($txt_search) {
                        $q->where('r.order_num', 'ilike', "%{$txt_search}%")
                            ->orWhere('cus.name', 'ilike', "%{$txt_search}%")
                            ->orWhere('u.name', 'ilike', "%{$txt_search}%")
                            ->orWhere('r.payment_method', 'ilike', "%{$txt_search}%")
                            ->orWhere('r.remark', 'ilike', "%{$txt_search}%");
                    });
                })
                ->orderByDesc('r.created_at')
                ->get();

            return response()->json(['getAll' => $order]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch orders: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch orders.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(OrderRequest $orderRequest, OrderDetailRequest $orderDetailRequest)
    {
        DB::beginTransaction();
        try {
            $orderNumber = $this->generateOrderNumber();

            $orderData = $orderRequest->validated();
            $orderData['order_num'] = $orderNumber;
            $orderData['user_id'] = Auth::id();
            $orderData['create_by'] = Auth::user()->name;

            $order = Order::create($orderData);

            $details = $orderDetailRequest->validated()['order_detail'];

            foreach ($details as $detail) {
                $detail['order_id'] = $order->id;
                OrderDetail::create($detail);
                Product::where('id', $detail['product_id'])->decrement('qty', $detail['qty']);
            }

            DB::commit();

            $currentOrder = Order::with('orderDetail')->find($order->id);

            return response()->json([
                'message' => 'Order successfully created.',
                'order' => $currentOrder,
                'order_detail' => $currentOrder->orderDetail,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create order: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create order.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * No try/catch here — let store() catch and show the real error.
     */
    private function generateOrderNumber(): string
    {
        $currentDateHour = now()->format('YmdH');

        $orderCount = DB::table(DB::raw('"order"'))
            ->whereRaw("TO_CHAR(created_at, 'YYYYMMDDHH24') = ?", [$currentDateHour])
            ->count();

        return 'INV-WU-' . $currentDateHour . ($orderCount + 1);
    }

    public function show($id)
    {
        try {
            if (!is_numeric($id)) {
                return response()->json(['message' => 'Invalid order ID.'], 400);
            }

            $order = DB::table(DB::raw('"order" as r'))
                ->leftJoin('customer as cus', 'r.customer_id', '=', 'cus.id')
                ->leftJoin('users as u', 'r.user_id', '=', 'u.id')
                ->select('r.*', 'cus.name as customer_name', 'u.name as user_name')
                ->where('r.id', '=', $id)
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found.'], 404);
            }

            return response()->json([
                'message' => 'Order retrieved successfully.',
                'order' => $order,
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve order.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getOrderDetail($id)
    {
        try {
            if (!is_numeric($id)) {
                return response()->json(['message' => 'Invalid order ID.'], 400);
            }

            $details = DB::table('order_detail as od')
                ->leftJoin('product as p', 'od.product_id', '=', 'p.id')
                ->leftJoin('category as cat', 'p.category_id', '=', 'cat.id')
                ->leftJoin(DB::raw('"order" as o'), 'od.order_id', '=', 'o.id')
                ->leftJoin('users as u', 'o.user_id', '=', 'u.id')
                ->select(
                    'od.*',
                    'p.name as product_name',
                    'cat.name as p_category_name',
                    'u.name as user_name',
                    'o.order_num',
                    'o.paid_amount',
                    'o.payment_method',
                    'o.remark',
                    'o.created_at as order_date'
                )
                ->where('od.order_id', '=', $id)
                ->get();

            if ($details->isEmpty()) {
                return response()->json(['message' => 'No order details found.'], 404);
            }

            return response()->json(['get_one' => $details], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve order detail.', 'error' => $e->getMessage()], 500);
        }
    }

}
