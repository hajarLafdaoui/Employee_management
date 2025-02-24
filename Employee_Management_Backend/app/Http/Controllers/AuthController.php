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
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid email or password'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    
        $user = JWTAuth::user();
        
        // Set is_active to 1 when user logs in
        $user->is_active = 1;
        $user->save(); // Save the updated status in the database
    
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'username' => $user->username,
                'phone' => $user->phone,
                'profile_picture' => $user->profile_picture,
                'job_title' => $user->job_title,
                'company' => $user->company,
                'department' => $user->department,
                'status' => $user->status,
                'last_login' => $user->last_login,
                'nationality' => $user->nationality,
                'country' => $user->country,
                'is_active' => $user->is_active,
            ]
        ]);
    }
    
    // Logout function
}
