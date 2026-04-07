<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    //

    protected $table = 'supplier';

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'email',
        'address',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'supplier_id');
    }
}
