<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Get all users
    public function index()
    {
        $users = User::all(); 
        return response()->json($users);
    }

    // Get user by ID
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    // Create a new user
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|max:50',
            'department_id' => 'required|exists:departments,id',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'department_id' => $request->department_id,
        ]);
    
        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user,
        ], 201);
    }

    public function update(Request $request, $id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,' . $id,
        'password' => 'nullable|string|min:8|confirmed', 
        'role' => 'required|string', 
        'department_id' => 'nullable|integer' 
    ]);

    if ($request->has('name')) {
        $user->name = $validatedData['name'];
    }

    if ($request->has('email')) {
        $user->email = $validatedData['email'];
    }

    if ($request->has('password')) {
        $user->password = Hash::make($validatedData['password']);
    }

    if ($request->has('role')) {
        $user->role = $validatedData['role'];
    }

    if ($request->has('department_id')) {
        $user->department_id = $validatedData['department_id'];
    }

    $user->save();

    return response()->json([
        'message' => 'User updated successfully',
        'user' => $user
    ], 200);
}


    // Delete user by ID
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}