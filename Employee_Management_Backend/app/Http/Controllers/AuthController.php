<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // Login function
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    try {
        // Attempt to get the token
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    } catch (JWTException $e) {
        return response()->json(['error' => 'Could not create token'], 500);
    }

    // Get the authenticated user
    $user = JWTAuth::user();
    
    if ($user->is_deleted) {
        return response()->json(['error' => 'Your account has been deactivated. Please contact support.'], 403);
    }
    // Return the token along with user data (name, email, role)
    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id, 
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'username' => $user->username,           // Add username
            'phone' => $user->phone,                
            'profile_picture' => $user->profile_picture, 
            'job_title' => $user->job_title,        
            'company' => $user->company,            
            'department' => $user->department,       
            'status' => $user->status,             
            'last_login' => $user->last_login       
        ]
    ]);
}

}