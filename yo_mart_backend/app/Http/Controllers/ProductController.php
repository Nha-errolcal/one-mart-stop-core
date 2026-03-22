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
        $txt_search = $request->input('search');
        $category_id = $request->input('category_id');

        $getAll = DB::table('product')
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

        return response()->json([
            'getAll' => $getAll,
        ]);
    }


    public function store(ProductRequest $product)
    {
        $product->validated();

        if (Auth::check()) {
            $product['create_by'] = Auth::user()->name;
        } else {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }


        $dataForFind = $product->all();

        if ($product->hasFile('image')) {
            $dataForFind['image'] = $product->file('image')->store('products', 'laravel_api_image');
            /**
             * ****************** process ****************** :
             * $dataForFind['image']=products/RriQzVaw784LDv604GzXr0wBFFeHsvs7Up3uVvCG.png
             * http://localhost/laravel_api_image/products/RriQzVaw784LDv604GzXr0wBFFeHsvs7Up3uVvCG.png
             */
        }


        $product = Product::create($dataForFind);

        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product,
            'image' => $product->image ?? null,
        ], 201);
    }



    public function update(ProductRequest $request, Product $product)
    {
        try {

            $validatedData = $request->validated();


            if (!empty($request->image_remove) && $product->image) {
                $this->removeOldImage($product->image);
                $validatedData['image'] = null;
            }

            // new image upload
            if ($request->hasFile('image')) {
                if ($product->image) {
                    $this->removeOldImage($product->image); // Remove the old image
                }
                $validatedData['image'] = $request->file('image')->store('products', 'laravel_api_image');
            }

            // Update the product with all validated data
            $product->update($validatedData);

            return response()->json([
                'message' => 'Product updated successfully!',
                'product' => $product,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    // protected function handleImageUpload($productRequest, $product)
    // {
    //     // Generate a new image name
    //     $imageName = time() . '.' . $productRequest->image->extension();
    //     $path = $productRequest->image->storeAs('images', $imageName, 'laravel_api_image');

    //     // Remove old image if it exists
    //     $this->removeOldImage($product->image);

    //     return $path;
    // }


    protected function removeOldImage($imagePath)
    {
        if (Storage::disk('laravel_api_image')->exists($imagePath)) {
            Storage::disk('laravel_api_image')->delete($imagePath);
        }
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Remove the image if exists before deleting the product
        if ($product->image) {
            $this->removeOldImage($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully!',
        ], 200);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'product' => $product,
        ], 200);
    }
}
