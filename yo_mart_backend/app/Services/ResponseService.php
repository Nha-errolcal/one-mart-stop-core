<?php

namespace App\Services;

class ResponseService
{
    public function success($data = null, $message = "Success", $status = 200)
    {
        return [
            "success" => true,
            "status" => $status,
            "message" => $message,
            "data" => $data,
            "error" => null,
            "timestamp" => now()
        ];
    }

    public function error($message = "Error", $error = null, $status = "")
    {
        return [
            "success" => false,
            "status" => $status,
            "message" => $message,
            "data" => null,
            "error" => $error,
            "timestamp" => now()
        ];
    }

    public function created($data = null, $message = "Resource created successfully")
    {
        return [
            "success" => true,
            "code" => 201,
            "message" => $message,
            "data" => $data,
            "error" => null,
            "timestamp" => now()
        ];
    }

}
