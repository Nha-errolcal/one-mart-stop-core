<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class ApiLogger
{
    public function handle($request, Closure $next)
    {
        if (!env('API_LOGGER', true)) {
            return $next($request);
        }

        $start = microtime(true);

        // 📥 Request info
        $method = $request->method();
        $url = '/' . $request->path();
        $ip = $request->ip();
        $userId = auth()->id() ?? 'guest';

        // Remove sensitive fields
        $requestData = $request->except(['password', 'password_confirmation', 'token']);

        // 👉 Process request
        $response = $next($request);

        $time = round((microtime(true) - $start) * 1000, 2);
        $status = $response->getStatusCode();

        // Safe response preview
        $responseContent = null;
        try {
            $responseContent = json_decode($response->getContent(), true);
        } catch (\Throwable $e) {
            $responseContent = 'non-json response';
        }
        if ($responseContent) {
            $responseContent = substr(json_encode($responseContent), 0, 500);
        }

        // 🎨 Colors
        $statusColor = match (true) {
            $status >= 500 => "\033[31m", // red
            $status >= 400 => "\033[33m", // yellow
            $status >= 300 => "\033[36m", // cyan
            $status >= 200 => "\033[32m", // green
            default => "\033[0m",
        };
        $methodColor = match ($method) {
            'GET' => "\033[34m",
            'POST' => "\033[35m",
            'PUT' => "\033[33m",
            'DELETE' => "\033[31m",
            default => "\033[0m",
        };
        $reset = "\033[0m";

        // 🧾 Terminal output (forces print even via Postman/browser)
        $logLine = sprintf(
            "%s%-6s%s %s %s%d%s - %7sms | user:%s | ip:%s",
            $methodColor,
            $method,
            $reset,
            $url,
            $statusColor,
            $status,
            $reset,
            $time,
            $userId,
            $ip
        );

        // Print directly to terminal
        if (defined('STDOUT')) {
            fwrite(STDOUT, $logLine . PHP_EOL);
        }

        // 📂 Save to laravel.log
        Log::info('API REQUEST', [
            'method' => $method,
            'url' => $url,
            'status' => $status,
            'time_ms' => $time,
            'user_id' => $userId,
            'ip' => $ip,
            'request' => $requestData,
            'response' => $responseContent,
        ]);

        // ❌ Log errors separately
        if ($status >= 500) {
            Log::error('API ERROR', [
                'url' => $url,
                'response' => $responseContent,
            ]);
        }

        return $response;
    }
}
