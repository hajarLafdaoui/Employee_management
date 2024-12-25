<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Tymon\JWTAuth\Http\Middleware\Authenticate;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');





Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);


// CRUD operations for users

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);



// Route::middleware([Authenticate::class])->get('user', [AuthController::class, 'user']);
// Route::middleware([Authenticate::class])->post('update-profile', [UserController::class, 'update']);
