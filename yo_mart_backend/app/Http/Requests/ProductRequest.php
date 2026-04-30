<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:category,id',
            'qty' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'supplier_id' => 'nullable|exists:supplier,id',
            'product_in' => 'sometimes|required|numeric|min:0|max:999999.99',
            'product_out' => 'sometimes|required|numeric|min:0|max:999999.99',
            'description' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0|max:100', //%
        ];
    }
}
