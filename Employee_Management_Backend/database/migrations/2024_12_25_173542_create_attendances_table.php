<?php
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'attendance_date' => 'required|date',
            'is_present' => 'required|in:present,absent,leave',
        ]);

        $attendance = Attendance::create([
            'user_id' => $request->user_id,
            'attendance_date' => $request->attendance_date,
             'is_present' => $request->status,
        ]);

        return response()->json($attendance, 201);
    }

    public function index()
    {
        $attendances = Attendance::all();
        return response()->json($attendances);
    }
}
