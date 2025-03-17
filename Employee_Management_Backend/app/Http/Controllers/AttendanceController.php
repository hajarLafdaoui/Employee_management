<?php
// use App\Http\Controllers\Controller; // Ensure this line is present if it's missing
namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller

{
   public function index(){
    $attendances = Attendance::with('user.department')->get();
    return response()->json($attendances);   
                                                                
}
public function show($id)
{
    $attendance = Attendance::with('user.department')->find($id); 
    if (!$attendance) {
        return response()->json(['message' => 'Attendance not found'], 404);
    }
    return response()->json($attendance);
}

public function update(Request $request, $id)
{
    try {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:present,absent,leave',
        ]);

        $attendance->update([
            'status' => $validated['status'],
        ]);

        return response()->json(['message' => 'Attendance updated successfully'], 200);
    } catch (\Exception $e) {
        \Log::error('Error updating attendance: ', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Error updating attendance'], 500);
    }
}


    public function destroy($id){
        $attendance = Attendance::find($id);
        $attendance->delete();
        return response()->json(['message' => 'attendance deleted successfully']);

    }
    

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'records' => 'required|array',
                'records.*.user_id' => 'required|exists:users,id',  // Make sure the user_id exists in the users table
                'records.*.attendance_date' => 'required|date',
                'records.*.status' => 'required|in:present,absent,leave',
            ]);
            \Log::info('Validated Data:', $validated);
            
    
            foreach ($validated['records'] as $record) {
                Attendance::create([
                    'user_id' => $record['user_id'],
                    'attendance_date' => $record['attendance_date'], // Use $record['attendance_date']
                                    'status' => $record['status'],
                ]);
            }
    
            return response()->json(['message' => 'Attendance recorded successfully'], 200);
    
        } catch (\Exception $e) {
            \Log::error('Error saving attendance: ', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error saving attendance'], 500);
        }
    }

    //Employee Attendance Filtering
    public function getUserAttendance($userId, Request $request)
{
    $startDate = $request->query('start_date', now()->subWeek()->toDateString()); 
    $endDate = $request->query('end_date', now()->toDateString()); 

    $attendance = Attendance::where('user_id', $userId)
        ->whereBetween('attendance_date', [$startDate, $endDate])
        ->get();

    if ($attendance->isEmpty()) {
        return response()->json(['message' => 'No attendance records found'], 404);
    }

    return response()->json($attendance);
}

}    
