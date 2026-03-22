<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
            'customer_id' => 'nullable|integer|exists:customer,id',
            'user_id' => 'exists:users,id',
            'paid_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'remark' => 'nullable|string',
        ];
    }
}
