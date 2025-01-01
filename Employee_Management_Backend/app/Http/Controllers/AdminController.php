<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    //// Controller: AdminController.php
public function getAttendance(Request $request)
{
    $attendances = Attendance::whereDate('attendance_date', now()->toDateString())
        ->with('user')  // Fetch related user data
        ->get();

    return response()->json(['attendances' => $attendances]);
}

}
