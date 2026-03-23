<?php

use App\Helpers\ResponseData;

if (!function_exists('apiResponse')) {
    function apiResponse($data = null, $message = "Success")
    {
        $response = new ResponseData();
        return $response->success($data, $message);
    }
}

if (!function_exists('apiError')) {
    function apiError($message = "Error", $error = null)
    {
        $response = new ResponseData();
        return $response->error($message, $error);
    }
}
