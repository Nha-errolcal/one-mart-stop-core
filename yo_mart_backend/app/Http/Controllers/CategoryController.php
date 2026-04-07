<?php
namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Throwable;

class CategoryController extends Controller
{
    public function index()
    {
        // $getAll = Category::all();
        $txt_search = request()->input('search');
        $getAll = Category::when($txt_search, function ($query, $txt_search) {
            return $query->where('name', 'like', "%{$txt_search}%");
        })
            ->orderBy('id', 'desc')
            ->get();
        return response()->json([
            "code" => 200,
            "message" => "Get all categories successfully!",
            'getAll' => $getAll
        ]);
    }
    public function store(CategoryRequest $request)
    {
        try {
            $validated = $request->validated();


            if (Auth::check()) {
                $validated['create_by'] = Auth::user()->name;
            } else {
                return response()->json([
                    'message' => 'User not authenticated.',
                ], 401);
            }

            $create = Category::create($validated);

            return response()->json([
                'data' => $create,
                'message' => 'Category created successfully.'
            ]);
        } catch (Throwable $error) {
            return response()->json([
                'message' => 'Category not found.',
                'error' => $error->getMessage()
            ], 404);
        }
    }




    public function show(string $id)
    {
        try {

            $getOne = Category::findOrFail($id);

            return response()->json([
                'getOne' => $getOne,
                'message' => 'Category retrieved successfully.',
            ]);

        } catch (ModelNotFoundException $error) {

            return response()->json([
                'message' => 'Category not found.',
                'error' => $error->getMessage()
            ], 404);
        }
    }

    public function update(CategoryRequest $request, $id)
    {
        $validated = $request->validated();

        $employee = Category::findOrFail($id);

        $employee->update($validated);
        $updateBy = Auth::user()->name;

        return response()->json([
            'message' => 'Category updated successfully.',
            'update_by' => $updateBy,
        ]);
    }

    public function destroy(string $id)
    {

        $category = Category::findOrFail($id);


        $deletedBy = Auth::user()->name;

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
            'deleted_by' => $deletedBy,
        ]);
    }

}
