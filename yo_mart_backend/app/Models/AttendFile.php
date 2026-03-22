<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendFile extends Model
{
    use HasFactory;

    protected $table = 'attend_file';

    protected $fillable = [
        'product_id',
        'filename',
        'file_path',
        'length',
        'chunkSize',
        'contentType',
        'uploadDate',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
