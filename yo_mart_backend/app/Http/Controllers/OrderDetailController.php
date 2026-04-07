<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use function Laravel\Prompts\select;
use function PHPUnit\Framework\isEmpty;

class OrderDetailController extends Controller
{
    public function index()
    {
        try {
            $getAll = OrderDetail::all();

            return response()->json([
                'code' => 200,
                'getAll' => $getAll
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to Order detail.'
            ], 500);
        }
    }


    public function show($id)
    {
        try {
            $getOne = DB::table('order_detail as od')
                ->join('product as p', 'od.product_id', '=', 'p.id')
                ->join('category as c', 'p.category_id', '=', 'c.id')
                ->select(
                    'od.id',
                    'od.qty',
                    'od.price',
                    'od.discount',
                    'od.total',
                    'p.name as p_name',
                    'p.image as p_image',
                    'c.name as p_category_name'
                )
                ->where('od.order_id', $id)
                ->get();

            if ($getOne->isEmpty()) {
                return response()->json([
                    'message' => 'Order details not found for the given order ID.',
                ], 404);
            }

            $order = DB::table('order')->where('id', $id)->first();

            return response()->json([
                'message' => 'Order details retrieved successfully.',
                'order' => $order,
                'get_one' => $getOne,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve order details.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
