<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    //
    use HasFactory;
    protected $table = 'admins';
    protected $fillable = [
        'name',
        'email',
        'phone',
        'province',
        'district',
        'store_no',
        'village',
        'street',
        'house_no',
        'address_note',
        'branch',
        'company_name',
        'logo',
        'status',
        'created_by',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'admin_id');
    }
}
