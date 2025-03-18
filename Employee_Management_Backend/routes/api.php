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


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


// auth
Route::post('/login', [AuthController::class, 'login']);
Route::put('/users/{userId}/status', [UserController::class, 'updateStatus']);

action: 
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');

// CRUD operations for users
Route::get('/users', [UserController::class, 'index']);
Route::get('/getall', [UserController::class, 'getall']);

Route::get('/employees', [UserController::class, 'fetchEmployees']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::put('/users/{id}/toggle', [UserController::class, 'toggleStatus']);
Route::middleware('auth:api')->put('/user/change-password', [UserController::class, 'changePassword']);
Route::put('/users/{id}/toggle', [UserController::class, 'softDelete']);

// Route::delete('/users/{id}', [UserController::class, 'destroy']);


// Departments
Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
Route::get('/departments/{id}', [DepartmentController::class, 'show']);

Route::post('/departments/{id}', [DepartmentController::class, 'store']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);

Route::get('/jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);

Route::put('/jobs/{id}', [JobController::class, 'update']);
Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
Route::get('/departments/{id}/employees', [DepartmentController::class, 'getEmployeesByDepartment']);
// BarChart
Route::get('/employee-count', [DepartmentController::class, 'getEmployeeCountByDepartment']);


Route::get('/departments/{departmentId}/jobs', [DepartmentController::class, 'getJobsByDepartment']);


// Attendance
Route::post('/attendance', [AttendanceController::class, 'store']);
Route::get('/attendance', [AttendanceController::class, 'index']);
Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);
//Employee Attendance Filtering
Route::get('/attendance/user/{userId}', [AttendanceController::class, 'getUserAttendance']);


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
Route::get('/salaries', [SalaryController::class, 'getAllSalaries']);
Route::get('/salaries/{id}', [SalaryController::class, 'getSalary']);
Route::post('/calculate-salary', [SalaryController::class, 'calculateSalary']);
Route::put('/salaries/{id}', [SalaryController::class, 'editSalary']);
Route::delete('/salaries/{id}', [SalaryController::class, 'deleteSalary']);
Route::post('/salaries/{id}/show', [SalaryController::class, 'show']);
//holiday
Route::get('/holidays', [HolidayController::class, 'index']);
Route::post('/holidays', [HolidayController::class, 'store']);
Route::delete('/holidays/{id}', [HolidayController::class, 'destroy']);
Route::put('/holidays/{id}', [HolidayController::class, 'update']);






