<?php
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            '*.user_id' => 'required|exists:users,id',
            '*.status' => 'required|in:present,absent,leave',
        ]);
        
    
        $attendances = [];
        foreach ($request->all() as $attendance) {
            $attendances[] = Attendance::create([
                'user_id' => $attendance['user_id'],
                'attendance_date' => now(),
                'status' => $attendance['status'],
            ]);
        }
    
        return response()->json($attendances, 201);
    }
    

    public function index()
    {
        $attendances = Attendance::all();
        return response()->json($attendances);
    }
}
