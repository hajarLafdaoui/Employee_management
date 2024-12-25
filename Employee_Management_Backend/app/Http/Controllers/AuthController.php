<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $user->createToken('API Token')->plainTextToken,
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
