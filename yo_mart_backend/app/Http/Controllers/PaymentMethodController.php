<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentMethodController extends Controller
{
    // Get all payment methods
    public function index()
    {
        try {
            $paymentMethods = PaymentMethod::all();
            return response()->json([
                'success' => true,
                'data' => $paymentMethods,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch Payment Methods: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error fetching payment methods.'
            ], 500);
        }
    }

    // Store a new payment method
    public function store(PaymentMethodRequest $request)
    {
        try {
            $paymentMethod = PaymentMethod::create($request->validated());
            return response()->json([
                'success' => true,
                'data' => $paymentMethod,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create Payment Method: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating payment method.'
            ], 500);
        }
    }

    // Get a specific payment method
    public function show($id)
    {
        try {
            $paymentMethod = PaymentMethod::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $paymentMethod,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch Payment Method: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Payment method not found.'
            ], 404);
        }
    }

    // Update a specific payment method
    public function update(PaymentMethodRequest $request, $id)
    {
        try {
            $paymentMethod = PaymentMethod::findOrFail($id);
            $paymentMethod->update($request->validated());
            return response()->json([
                'success' => true,
                'data' => $paymentMethod,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update Payment Method: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error updating payment method.'
            ], 500);
        }
    }

    // Delete a specific payment method
    public function destroy($id)
    {
        try {
            $paymentMethod = PaymentMethod::findOrFail($id);
            $paymentMethod->delete();
            return response()->json([
                'success' => true,
                'message' => 'Payment method deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete Payment Method: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error deleting payment method.'
            ], 500);
        }
    }
}
