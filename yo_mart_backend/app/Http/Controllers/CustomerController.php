<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Container\Attributes\DB;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function index()
    {
        try {
            $getAll = Customer::all();
            return response()->json([
                'getAll' => $getAll
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(CustomerRequest $customerRequest)
    {
        try {
            $validated = $customerRequest->validated();
            $validated['create_by'] = Auth::user()->name;

            $create = Customer::create($validated);

            return response()->json([
                'data' => $create,
                'message' => 'Customer created successfully.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create customer.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(CustomerRequest $customerRequest, $id)
    {
        try {
            $validated = $customerRequest->validated();

            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json([
                    'message' => 'Customer not found',
                ]);
            }

            $customer->update($validated);

            return response()->json([
                'message' => 'Customer updated successfully',
                'customer' => $customer
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update customer.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json([
                    'message' => 'Customer not found',
                ]);
            }

            $customer->delete();

            return response()->json([
                'message' => 'Customer deleted successfully.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete customer.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json([
                    'message' => 'Customer not found',
                ], 404);
            }

            return response()->json([
                'message' => 'Customer retrieved successfully.',
                'customer' => $customer
            ], 200);


        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customer.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
