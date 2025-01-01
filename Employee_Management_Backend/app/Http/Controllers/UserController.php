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
        'username' => 'required|string|max:255|unique:users', 
        'phone' => 'nullable|string|max:255',
        'profile_picture' => 'nullable|string|max:255',
        'job_title' => 'nullable|string|max:255',
        'company' => 'nullable|string|max:255',
        'status' => 'required|in:active,inactive',
        'last_login' => 'nullable|date',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    // Create the new user
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role,
        'department_id' => $request->department_id,
        'username' => $request->username,
        'phone' => $request->phone,
        'profile_picture' => $request->profile_picture,
        'job_title' => $request->job_title,
        'company' => $request->company,
        'status' => $request->status,
        'last_login' => $request->last_login,
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
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8', 
            'role' => 'nullable|string', 
            'department_id' => 'nullable|integer',
            'username' => 'nullable|string|max:255|unique:users,username,' . $id,
            'phone' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
            'last_login' => 'nullable|date',
        ]);
    
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
    
        if (isset($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }
    
        $user->role = $validatedData['role'];
        $user->department_id = $validatedData['department_id'] ?? $user->department_id;
        $user->username = $validatedData['username'] ?? $user->username;
        $user->phone = $validatedData['phone'] ?? $user->phone;
        $user->profile_picture = $validatedData['profile_picture'] ?? $user->profile_picture;
        $user->job_title = $validatedData['job_title'] ?? $user->job_title;
        $user->company = $validatedData['company'] ?? $user->company;
        $user->status = $validatedData['status'] ?? $user->status;
        $user->last_login = $validatedData['last_login'] ?? $user->last_login;
    
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
