<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $txt_search = $request->input('search');
            $category_id = $request->input('category_id');

            $products = DB::table('product')
                ->join('category', 'product.category_id', '=', 'category.id')
                ->select('product.*', 'category.name as category_name')
                ->when($txt_search, function ($query, $txt_search) {
                    return $query->where('product.name', 'like', "%{$txt_search}%")
                        ->orWhere('category.name', 'like', "%{$txt_search}%");
                })
                ->when($category_id, function ($query, $category_id) {
                    return $query->where('product.category_id', $category_id);
                })
                ->orderBy('product.created_at', 'desc')
                ->get();

            $products = $products->map(function ($item) {
                $item->image_url = $item->image
                    ? asset('storage/' . $item->image)
                    : null;
                return $item;
            });

            return response()->json([
                "code" => 200,
                "message" => "Get all products successfully!",
                'getAll' => $products
            ]);
        } catch (\Throwable $th) {
            dd($th);
            return response()->json(['message' => 'Get all failed', 'error' => $th->getMessage()], 500);
        }
    }

    // ✅ CREATE
    public function store(ProductRequest $request)
    {
        $validated = $request->validated();

        if (!Auth::check()) {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        $validated['create_by'] = Auth::user()->name;

        // upload image
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('file', 'public');
        }

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product,
            'image_url' => $product->image
                ? asset('storage/' . $product->image)
                : null,
        ], 201);
    }

    // ✅ UPDATE
    public function update(ProductRequest $request, Product $product)
    {
        try {
            $validated = $request->validated();

            // remove image
            if (!empty($request->image_remove) && $product->image) {
                Storage::disk('public')->delete($product->image);
                $validated['image'] = null;
            }

            // upload new image
            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }

                $validated['image'] = $request->file('image')->store('file', 'public');
            }

            $product->update($validated);

            return response()->json([
                'message' => 'Product updated successfully!',
                'product' => $product,
                'image_url' => $product->image
                    ? asset('storage/' . $product->image)
                    : null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Update error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ DELETE
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully!',
        ]);
    }

    // ✅ GET ONE
    public function show($id)
    {
        $product = Product::findOrFail($id);

        $product->image_url = $product->image
            ? asset('storage/' . $product->image)
            : null;

        return response()->json([
            'product' => $product,
        ]);
    }
}
