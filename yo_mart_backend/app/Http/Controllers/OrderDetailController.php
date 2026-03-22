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
                'getAll' => $getAll
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to Order detail: ' . $e->getMessage(), [
                'exception' => $e
            ]);
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
                ->select('od.*', 'p.name as p_name', 'c.name as p_category_name')
                ->where('od.order_id', $id)
                ->get();

            if ($getOne->isEmpty()) {
                return response()->json([
                    'message' => 'Order details not found for the given order ID.',
                ], 404);
            }


            return response()->json([
                'message' => 'Order details retrieved successfully.',
                'get_one' => $getOne,
                'id' => $id
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve order details for order ID ' . $id . ': ' . $e->getMessage(), [
                'exception' => $e,
                'order_id' => $id
            ]);


            return response()->json([
                'message' => 'Failed to retrieve order details.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
