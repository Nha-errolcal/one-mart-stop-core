<?php

namespace App\Services;

class ResponseService
{
    public function success($data = null, $message = "Success")
    {
        return [
            "success" => true,
            "message" => $message,
            "data" => $data,
            "error" => null,
            "timestamp" => now()
        ];
    }

    public function error($message = "Error", $error = null)
    {
        return [
            "success" => false,
            "message" => $message,
            "data" => null,
            "error" => $error,
            "timestamp" => now()
        ];
    }
}
