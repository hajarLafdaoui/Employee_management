<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    // Get all users
    public function index()
    {
        $employees = User::whereIn('role', ['employee', 'sub-admin'])
            ->get();

        return response()->json($employees);
    }

    // Get all employees 
    public function fetchEmployees()
    {
        $employees = User::where('role', 'employee')->get();
        return response()->json($employees);
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

    public function store(Request $request)
    {
        $isLoggedIn = auth()->check(); // returns true if the user is authenticated

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:employee,sub-admin',
            'department_id' => 'required|exists:departments,id',
            'username' => 'required|string|max:255|unique:users',
            'phone' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'base_salary' => 'required|numeric|min:0',
            'gender' => 'required|in:male,female',
            'nationality' => 'nullable|string|max:255',
            'payee' => 'nullable|string|max:255',
            'is_active' => 'boolean', // Assuming 'status' is boolean for active/inactive
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $request->file('profile_picture')->store('profile_pictures', 'public');
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
            'profile_picture' => $profilePicturePath,
            'base_salary' => $request->base_salary,
            'gender' => $request->gender,
            'nationality' => $request->nationality,
            'payee' => $request->payee,
            'is_active' => $isLoggedIn,  // Set to true only if the user is logged in
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
            'email' => "nullable|string|email|max:255|unique:users,email,$id",
            'password' => 'nullable|string|min:8',
            'role' => 'nullable|string',
            'department_id' => 'nullable|integer',
            'username' => "nullable|string|max:255|unique:users,username,$id",
            'phone' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'base_salary' => 'nullable|numeric|min:0',
            'gender' => 'nullable|in:male,female',
            'nationality' => 'nullable|string|max:255',
            'payee' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $profilePicturePath = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->profile_picture = $profilePicturePath;
        }

        $user->name = $validatedData['name'] ?? $user->name;
        $user->email = $validatedData['email'] ?? $user->email;

        if (isset($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        $user->role = $validatedData['role'] ?? $user->role;
        $user->department_id = $validatedData['department_id'] ?? $user->department_id;
        $user->username = $validatedData['username'] ?? $user->username;
        $user->phone = $validatedData['phone'] ?? $user->phone;
        $user->base_salary = $validatedData['base_salary'] ?? $user->base_salary;
        $user->gender = $validatedData['gender'] ?? $user->gender;
        $user->nationality = $validatedData['nationality'] ?? $user->nationality;
        $user->payee = $validatedData['payee'] ?? $user->payee;
        $user->is_active = $validatedData['is_active'] ?? $user->is_active;

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ], 200);
    }

    public function softDelete($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->save();

        return response()->json([
            'message' => 'User soft deleted successfully',
            'user' => $user,
        ], 200);
    }

    public function getUserNotifications(Request $request)
    {
        return response()->json($request->user()->notifications);
    }
    public function updateStatus(Request $request, $userId)
    {
        // Log received request
        \Log::info("Updating user status: ", ['userId' => $userId, 'status' => $request->is_active]);
    
        $request->validate([
            'is_active' => 'required|boolean',
        ]);
    
        try {
            $user = User::findOrFail($userId);
            $user->is_active = $request->is_active;
            $user->save();
    
            \Log::info("User status updated successfully", ['user' => $user]);
    
            return response()->json(['message' => 'User status updated successfully']);
        } catch (\Exception $e) {
            \Log::error("Failed to update user status", ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update user status'], 500);
        }
    }
    
}
