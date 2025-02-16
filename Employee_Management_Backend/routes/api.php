<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AttestationController;
use Tymon\JWTAuth\Http\Middleware\Authenticate;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\HolidayController;


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
Route::post('/departments', [DepartmentController::class, 'store']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
Route::get('/departments/{id}', [DepartmentController::class, 'show']);

Route::post('/departments/{id}', [DepartmentController::class, 'update']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);

Route::get('/jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);
Route::put('/jobs/{id}', [JobController::class, 'store']);
Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
Route::get('/departments/{id}/employees', [DepartmentController::class, 'getEmployeesByDepartment']);
Route::get('/employee-count', [DepartmentController::class, 'getEmployeeCountByDepartment']);




// Attendance
Route::post('/attendance', [AttendanceController::class, 'store']);
Route::get('/attendance', [AttendanceController::class, 'index']);
Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);

// Routes pour les demandes de congé

Route::post('/leave-request', [LeaveRequestController::class, 'submitRequest']);
Route::get('/leave-requests', [LeaveRequestController::class, 'getAllRequests']);
Route::put('/leave-request/{id}/approve', [LeaveRequestController::class, 'approveRequest']);
Route::put('/leave-request/{id}/reject', [LeaveRequestController::class, 'rejectRequest']);

// Attestations
Route::get('/attestations',[AttestationController::class,'index']);
Route::post('/attestations', [AttestationController::class, 'store']);
Route::put('/attestations/{id}',[AttestationController::class,'updateStatus']);
Route::delete('/attestations/{id}',[AttestationController::class,'destroy']);

Route::get('/attestations/user/{userId}', [AttestationController::class, 'show']);

//salary
Route::post('/calculate-salary', [SalaryController::class, 'calculateSalary']);
Route::get('/salaries', [SalaryController::class, 'getAllSalaries']);


//holiday
Route::get('/holidays', [HolidayController::class, 'index']);
Route::post('/holidays', [HolidayController::class, 'store']);
Route::delete('/holidays/{id}', [HolidayController::class, 'destroy']);
Route::put('/holidays/{id}', [HolidayController::class, 'update']);






Route::put('/users/{id}/toggle', [UserController::class, 'softDelete']);
