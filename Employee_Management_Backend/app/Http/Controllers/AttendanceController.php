<?php
// use App\Http\Controllers\Controller; // Ensure this line is present if it's missing
namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
public function store(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.user_id' => 'required|exists:users,id', // Ensures user_id exists in the users table
            'attendance_date' => 'nullable|date',

            
            'records.*.status' => 'required|in:present,absent,leave', // Assuming only these statuses
        ]);

        // Loop through each attendance record and create it
        foreach ($validated['records'] as $record) {
            Attendance::create([
                'user_id' => $record['user_id'],
                'date' => $record['attendance_date'] ?? now()->toDateString(), // Set default to current date if not provided

                'status' => $record['status'],
            ]);
        }

        return response()->json(['message' => 'Attendance recorded successfully'], 200);
    }
}
