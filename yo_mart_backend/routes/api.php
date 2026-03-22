<?php

use App\Http\Controllers\AttendFileController;
use App\Http\Controllers\OrderDetailController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;

Route::prefix('v2')->middleware(['validateToken'])->group(function () {
    // Authenticated routes
    Route::post('/profile', [AuthController::class, 'profile']);
    Route::get('/user', [AuthController::class, 'getUserAll']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/employees', [EmployeesController::class, 'index']);
    Route::post('/employees', [EmployeesController::class, 'store']);
    Route::get('/employees/{employee}', [EmployeesController::class, 'show']);
    Route::put('/employees/{employee}', [EmployeesController::class, 'update']);
    Route::delete('/employees/{employee}', [EmployeesController::class, 'destroy']);

    Route::get('/category', [CategoryController::class, 'index']);
    Route::post('/category', [CategoryController::class, 'store']);
    Route::get('/category/{category}', [CategoryController::class, 'show']);
    Route::put('/category/{category}', [CategoryController::class, 'update']);
    Route::delete('/category/{category}', [CategoryController::class, 'destroy']);

    Route::get('/product', [ProductController::class, 'index']);
    Route::post('/product', [ProductController::class, 'store']);
    Route::get('/product/{product}', [ProductController::class, 'show']);
    Route::put('/product/{product}', [ProductController::class, 'update']);
    Route::delete('/product/{product}', [ProductController::class, 'destroy']);

    Route::get('/customer', [CustomerController::class, 'index']);
    Route::post('/customer', [CustomerController::class, 'store']);
    Route::get('/customer/{customer}', [CustomerController::class, 'show']);
    Route::put('/customer/{customer}', [CustomerController::class, 'update']);
    Route::delete('/customer/{customer}', [CustomerController::class, 'destroy']);

    Route::get('/role', [RoleController::class, 'index']);
    Route::post('/role', [RoleController::class, 'store']);
    Route::get('/role/{role}', [RoleController::class, 'show']);
    Route::put('/role/{role}', [RoleController::class, 'update']);
    Route::delete('/role/{role}', [RoleController::class, 'destroy']);

    Route::get('/payments', [PaymentMethodController::class, 'index']);
    Route::post('/payments', [PaymentMethodController::class, 'store']);
    Route::get('/payments/{payment}', [PaymentMethodController::class, 'show']);
    Route::put('/payments/{payment}', [PaymentMethodController::class, 'update']);
    Route::delete('/payments/{payment}', [PaymentMethodController::class, 'destroy']);

    Route::get('/order', [OrderController::class, 'index']);
    Route::post('/order', [OrderController::class, 'store']);
    Route::get('/order/{order}', [OrderController::class, 'show']);
    Route::put('/order/{order}', [OrderController::class, 'update']);
    Route::delete('/order/{order}', [OrderController::class, 'destroy']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/dashboard', [DashboardController::class, 'store']);
    Route::get('/dashboard/{dashboard}', [DashboardController::class, 'show']);
    Route::put('/dashboard/{dashboard}', [DashboardController::class, 'update']);
    Route::delete('/dashboard/{dashboard}', [DashboardController::class, 'destroy']);

    Route::get('/order_detail', [OrderDetailController::class, 'index']);
    Route::post('/order_detail', [OrderDetailController::class, 'store']);
    Route::get('/order_detail/{order_detail}', [OrderDetailController::class, 'show']);
    Route::put('/order_detail/{order_detail}', [OrderDetailController::class, 'update']);
    Route::delete('/order_detail/{order_detail}', [OrderDetailController::class, 'destroy']);

    Route::get('/permission', [PermissionController::class, 'index']);
    Route::post('/permission', [PermissionController::class, 'store']);
    Route::get('/permission/{permission}', [PermissionController::class, 'show']);
    Route::put('/permission/{permission}', [PermissionController::class, 'update']);
    Route::delete('/permission/{permission}', [PermissionController::class, 'destroy']);

    Route::post('/role/{roleId}/sync-permissions', [RoleController::class, 'syncPermissions']);
    Route::post('/users/{userId}/sync-roles', [AuthController::class, 'syncRoles']);

    Route::prefix("report")->group(function () {
        Route::get("close_day", [ReportController::class, 'closeDay']);
        Route::get("monthly_sale", [ReportController::class, 'monthlySalesReport']);
    });
    Route::get('files/{file_name}/view', [AttendFileController::class, 'index']);
    Route::get('files/{id}/view', [AttendFileController::class, 'view']);
    Route::delete('files/{id}', [AttendFileController::class, 'destroy']);
});

// public routes
Route::prefix('v2')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});
