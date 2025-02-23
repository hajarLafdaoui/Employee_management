<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Salary;
use Illuminate\Http\Request;

class SalaryController extends Controller
{public function calculateSalary(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'paid_on' => 'required|date',
            'user_id' => 'required|exists:users,id',
        ]);
    
        $startDate = $validated['start_date'];
        $endDate = $validated['end_date'];
        $userId = $validated['user_id'];
        $paidOn = $validated['paid_on'];
    
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
        $department = $user->department;
        if (!$department) {
            return response()->json(['message' => 'User does not have an associated department.'], 400);
        }
    
        $job = $department->jobs()->first();
        if (!$job) {
            return response()->json(['message' => 'Department does not have an associated job.'], 400);
        }
    
        $attendances = Attendance::where('user_id', $userId)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->where('status', 'present')
            ->count();
    
        $leaves = LeaveRequest::where('user_id', $userId)
            ->whereBetween('start_date', [$startDate, $endDate])
            ->count();
    
        $baseSalary = $job->salary;
        $attendanceDeduction = $attendances * 50;
        $leaveDeduction = $leaves * 50;
    
        $totalSalary = $baseSalary - $attendanceDeduction - $leaveDeduction;
    
        $tvaRate = 0.20; 
        $tvaAmount = $totalSalary * $tvaRate;
        $totalSalaryWithTva = $totalSalary - $tvaAmount;
    
        $salary = Salary::create([
            'user_id' => $userId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'attendances' => $attendances,
            'leaves' => $leaves,
            'attendance_bonus' => $attendanceDeduction,
            'leave_deduction' => $leaveDeduction,
            'total_salary' => $totalSalaryWithTva,
            'paid_on' => $paidOn,
            'tva_rate' => $tvaRate,
            'tva_amount' => $tvaAmount,
        ]);
    
        return response()->json([
            'message' => 'Salary calculated and stored successfully with TVA',
            'salary' => $salary
        ]);
    }
    
    public function getAllSalaries()
    {
        $salaries = Salary::with('user')->get();
        return response()->json(['salaries' => $salaries]);
    }

    public function getSalary($id)
    {
        $salary = Salary::with('user')->findOrFail($id);
        return response()->json(['salary' => $salary]);
    }

    // Edit salary
    public function editSalary(Request $request, $id)
    {
        $salary = Salary::findOrFail($id);
    
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_salary' => 'required|numeric|min:0',
        ]);
    
        $userId = $validated['user_id'];
        $startDate = $validated['start_date'];
        $endDate = $validated['end_date'];
    
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
        $department = $user->department;
        if (!$department) {
            return response()->json(['message' => 'User does not have an associated department.'], 400);
        }
    
        $job = $department->jobs()->first();
        if (!$job) {
            return response()->json(['message' => 'Department does not have an associated job.'], 400);
        }
    
        $attendances = Attendance::where('user_id', $userId)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->where('status', 'present')
            ->count();
    
        $leaves = LeaveRequest::where('user_id', $userId)
            ->whereBetween('start_date', [$startDate, $endDate])
            ->count();
    
        $baseSalary = $job->salary;
        $attendanceDeduction = $attendances * 50;
        $leaveDeduction = $leaves * 50;
    
        $totalSalary = $baseSalary - $attendanceDeduction - $leaveDeduction;
    
        $salary->update([
            'user_id' => $userId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_salary' => $totalSalary,
        ]);
    
        return response()->json([
            'message' => 'Salary updated successfully',
            'salary' => $salary
        ]);
    }
    

    // Delete salary
    public function deleteSalary($id)
    {
        $salary = Salary::findOrFail($id);
        $salary->delete();

        return response()->json(['message' => 'Salary deleted successfully']);
    }

 // Show salary details by ID
public function show($id)
{
    $salary = Salary::with('user')->findOrFail($id);
    return response()->json(['salary' => $salary]);
}

}
