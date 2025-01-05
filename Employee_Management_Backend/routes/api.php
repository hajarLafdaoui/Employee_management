<?php

use App\Http\Controllers\AttestationController;
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
Route::put('/users/{id}/toggle', [UserController::class, 'toggleStatus']);

// Route::delete('/users/{id}', [UserController::class, 'destroy']);


// Departments
Route::get('/departments', [DepartmentController::class, 'index']);



// Attendance
Route::post('/attendance', [AttendanceController::class, 'store']);

Route::get('/attendance', [AttendanceController::class, 'index']);
Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);

// Attestations
Route::get('/attestations',[AttestationController::class,'index']);
Route::post('/attestations', [AttestationController::class, 'store']);
Route::put('/attestations/{id}',[AttestationController::class,'updateStatus']);
Route::delete('/attestations/{id}',[AttestationController::class,'destroy']);



