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

    // Return the token along with user data (name, email, role)
    return response()->json([
        'token' => $token,
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role // Include the role here
        ]
    ]);
}

}