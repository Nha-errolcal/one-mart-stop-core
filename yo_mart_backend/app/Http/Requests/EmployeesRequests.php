<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeesRequests extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|max:255|string',
            'employment_date' => 'required|date',
            'salary' => 'required',
            'bonus' => 'required',
            'dob' => 'required|date',
            'gender' => 'required|integer',
        ];
    }
}

