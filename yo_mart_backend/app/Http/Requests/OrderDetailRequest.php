<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderDetailRequest extends FormRequest
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
            'order_detail.*.product_id' => 'required|exists:product,id',
            'order_detail.*.qty' => 'required|numeric|min:1',
            'order_detail.*.price' => 'required|numeric|min:0',
            'order_detail.*.total' => 'required|numeric|min:0',
            'order_detail.*.discount' => 'nullable|numeric|min:0|max:100',
        ];
    }
}
