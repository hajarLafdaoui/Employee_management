<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Salary; 
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    public function calculateSalary(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'user_id' => 'required|exists:users,id', 
        ]);

        $startDate = $validated['start_date'];
        $endDate = $validated['end_date'];
        $userId = $validated['user_id'];



        $existingSalary = Salary::where('user_id', $userId)
        ->where('start_date', $startDate)
        ->where('end_date', $endDate)
        ->first();



        if ($existingSalary) {
            return response()->json([
                'message' => 'Salary has already been calculated for this date range.',
                'salary' => $existingSalary,
            ]);
        }
        
        $user = User::findOrFail($userId);

        $attendances = Attendance::where('user_id', $userId)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->where('status', 'present')
            ->count();

        $leaves = LeaveRequest::where('user_id', $userId)
            ->whereBetween('start_date', [$startDate, $endDate])
            ->count();

        $baseSalary = $user->base_salary;

        $attendanceDeduction = $attendances * 50; 
        $leaveDeduction = $leaves * 50; 

        $totalSalary = $baseSalary - $attendanceDeduction - $leaveDeduction;

        $salary = new Salary();  
        $salary->user_id = $userId;
        $salary->start_date = $startDate;
        $salary->end_date = $endDate;
        $salary->total_salary = $totalSalary;
        $salary->save();  

        return response()->json([
            'name' => $user->name,
            'attendances' => $attendances,
            'leaves' => $leaves,
            'base_salary' => $baseSalary,
            'attendance_deduction' => $attendanceDeduction,
            'leave_deduction' => $leaveDeduction,
            'total_salary' => $totalSalary,
        ]);
    }





    
    public function getAllSalaries()
    {
        $salaries = Salary::with('user')->get();

        return response()->json([
            'salaries' => $salaries,
        ]);
    }
  




    
}
