<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employees extends Model
{
    protected $fillable = [
        'name',
        'employment_date',
        'salary',
        'bonus',
        'dob',
        'gender',
        'create_by'
    ];
}
