<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AttendanceController;
use Tymon\JWTAuth\Http\Middleware\Authenticate;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// auth
Route::post('/login', [AuthController::class, 'login']);


// CRUD operations for users
Route::get('/users', [UserController::class, 'index']);
Route::get('/employees', [UserController::class, 'fetchEmployees']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Departments
Route::get('/departments', [DepartmentController::class, 'index']);



// Attendance
Route::post('/attendance', [AttendanceController::class, 'store']);
Route::get('/attendance', [AttendanceController::class, 'index']);

