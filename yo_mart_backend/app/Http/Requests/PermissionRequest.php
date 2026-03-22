<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionId = $this->route('permission') ?? $this->route('id');

        $uniqueCode = Rule::unique('permissions', 'code');

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $uniqueCode = $uniqueCode->ignore($permissionId);
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255', $uniqueCode],
        ];
    }
}
