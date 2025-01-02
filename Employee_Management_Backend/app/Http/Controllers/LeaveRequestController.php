<?php
namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    // Soumettre une demande de congé
    public function submitRequest(Request $request)
    {
        // Vérifier si l'utilisateur est authentifié
        if (!Auth::check()) {
            return response()->json(['error' => 'Non autorisé'], 401);
        }

        $request->validate([
            'leave_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'reason' => 'required|string',
        ]);

        $leaveRequest = LeaveRequest::create([
            'user_id' => Auth::id(),  // Utilisez Auth::id() pour récupérer l'ID de l'utilisateur authentifié
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
        ]);

        return response()->json($leaveRequest);
    }

    // Approuver une demande de congé
    public function approveRequest($id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Non autorisé'], 401);
        }

        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->status = 'approved';
        $leaveRequest->save();

        return response()->json($leaveRequest);
    }

    // Rejeter une demande de congé
    public function rejectRequest($id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Non autorisé'], 401);
        }

        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->status = 'rejected';
        $leaveRequest->save();

        return response()->json($leaveRequest);
    }
}
