<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|unique:users,username',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|confirmed|min:6|string',
        ];
    }
}
