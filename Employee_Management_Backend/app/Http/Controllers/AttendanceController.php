<?php
// use App\Http\Controllers\Controller; // Ensure this line is present if it's missing
namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller

{
    public function destroy($id){
        $attendance = Attendance::find($id);
        $attendance->delete();
        return response()->json(['message' => 'attendance deleted successfully']);

    }
    
    public function update(Request $request, $id)
    {
        try {
            $attendance = Attendance::findOrFail($id); 
            $validated = $request->validate([
                'status' => 'required|in:present,absent,leave',
                'attendance_date' => 'nullable|date',
            ]);
    
            $attendance->update([
                'status' => $validated['status'],
                'attendance_date' => $validated['attendance_date'] ?? $attendance->attendance_date,
            ]);
    
            return response()->json(['message' => 'Attendance updated successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating attendance: ', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error updating attendance'], 500);
        }
    }
    
        
    public function index(){
        // $attendances = Attendance::all();
        $attendances = Attendance::with('user.department')->get();
        return response()->json($attendances);   
                                                                    
    }
    
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'records' => 'required|array',
                'records.*.user_id' => 'required|exists:users,id',
                'attendance_date' => 'nullable|date',
                'records.*.status' => 'required|in:present,absent,leave',
            ]);
    
            foreach ($validated['records'] as $record) {
                Attendance::create([
                    'user_id' => $record['user_id'],
                    'attendance_date' => $validated['attendance_date'] ?? now()->toDateString(),
                    'status' => $record['status'],
                ]);
            }
    
            return response()->json(['message' => 'Attendance recorded successfully'], 200);
    
        } catch (\Exception $e) {
            \Log::error('Error saving attendance: ', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error saving attendance'], 500);
        }
    }
}    
