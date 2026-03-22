<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Plain name — Laravel/PostgreSQL handles quoting automatically
    protected $table = 'order';

    protected $fillable = [
        'customer_id',
        'user_id',
        'paid_amount',
        'order_num',
        'payment_method',
        'remark',
        'create_by',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function orderDetail()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
}
