<?php
namespace App\Http\Controllers;

use App\Http\Requests\EmployeesRequests;
use App\Models\Employees;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployeesController extends Controller
{
    public function index()
    {
        $getAll = Employees::all();
        return response()->json([
            'employees' => $getAll
        ]);
    }

    public function store(EmployeesRequests $request)
    {
        $validated = $request->validated();
        $validated['create_by'] = Auth::user()->name;

        $create = Employees::create($validated);

        return response()->json([
            'create' => $create,
            'message' => 'Employee created successfully.'
        ]);
    }

    public function show(string $id)
    {
        $getOne = Employees::findOrFail($id);

        return response()->json([
            'getOne' => $getOne,
            'message' => 'Employee retrieved successfully.'
        ]);
    }

    public function update(EmployeesRequests $request, $id)
    {
        $validated = $request->validated();

        $employee = Employees::findOrFail($id);
        $employee->update($validated);

        return response()->json([
            'message' => 'Employee updated successfully.'
        ]);
    }

    public function destroy(string $id)
    {
        $employee = Employees::findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully.']);
    }
}
