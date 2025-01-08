<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use App\Notifications\LeaveRequestNotification;

class LeaveRequestController extends Controller
{
    // Soumettre une demande de congé
    public function submitRequest(Request $request)
    {
        $request->validate([
            // 'user_id' => 'required|exists:users,id',  // Ensure user_id is passed and exists
            'leave_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        $leaveRequest = LeaveRequest::create([
            'user_id' => $request->user_id,  // Get user_id from request
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => 'pending',  // Default status
        ]);

        return response()->json($leaveRequest);
    }

    // Obtenir toutes les demandes de congé

    public function getAllRequests()
    {
        $leaveRequests = LeaveRequest::with('user:id,name')->get();

        return response()->json($leaveRequests);
    }

    // Approuver une demande de congé
    public function approveRequest(Request $request, $id)
{
    $leaveRequest = LeaveRequest::findOrFail($id);
    $leaveRequest->status = 'approved';
    $leaveRequest->save();

    return response()->json($leaveRequest);
}

    // Rejeter une demande de congé
    public function rejectRequest(Request $request, $id)
{
    $leaveRequest = LeaveRequest::findOrFail($id);
    $leaveRequest->status = 'rejected';
    $leaveRequest->save();

    return response()->json($leaveRequest);
}
}
