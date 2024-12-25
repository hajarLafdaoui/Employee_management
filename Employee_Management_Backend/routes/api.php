<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');





Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'register']);

// Route::middleware([Authenticate::class])->get('user', [AuthController::class, 'user']);
// Route::middleware([Authenticate::class])->post('update-profile', [UserController::class, 'update']);
