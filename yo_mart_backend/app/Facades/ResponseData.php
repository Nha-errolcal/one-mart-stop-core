<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class ResponseData extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'response.service';
    }
}
