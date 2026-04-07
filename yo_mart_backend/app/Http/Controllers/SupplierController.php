<?php

namespace App\Http\Controllers;

use App\Facades\ResponseData as FacadesResponseData;
use App\Http\Requests\SupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Throwable;

class SupplierController extends Controller
{
    public function store(SupplierRequest $request)
    {
        try {
            $supplier = Supplier::create($request->validated());

            return response()->json(
                FacadesResponseData::success($supplier, "Supplier created successfully."),
                201
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function index(Request $request)
    {
        try {
            $query = Supplier::query();

            if ($request->search) {
                $query->where('name', 'ilike', '%' . $request->search . '%');
            }

            $suppliers = $query->orderBy('id', 'desc')->get();

            return response()->json(
                FacadesResponseData::success($suppliers, "Supplier list")
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function show($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);

            return response()->json(
                FacadesResponseData::success($supplier, "Supplier detail")
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                404
            );
        }
    }

    public function update(SupplierRequest $request, $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->update($request->validated());

            return response()->json(
                FacadesResponseData::success($supplier, "Supplier updated successfully.")
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }

    public function destroy($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();

            return response()->json(
                FacadesResponseData::success(null, "Supplier deleted successfully.")
            );
        } catch (Throwable $e) {
            return response()->json(
                FacadesResponseData::error("Error", $e->getMessage()),
                500
            );
        }
    }
}
