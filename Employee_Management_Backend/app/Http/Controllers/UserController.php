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
        ->where('is_deleted', false)
        ->get(); 
    
        return response()->json($employees);  
    }
    // get all employees 
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:employee,sub-admin',
            'department_id' => 'required|exists:departments,id',
            'username' => 'required|string|max:255|unique:users',
            'phone' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'base_salary' => 'required|numeric|min:0'
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
    
        // Validate the input
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'nullable|string|in:employee,sub-admin',
            'department_id' => 'nullable|exists:departments,id',
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
            'phone' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'base_salary' => 'nullable|numeric|min:0',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
    
        // Update fields if they are provided in the request
        if ($request->has('name')) {
            $user->name = $request->name;
        }
    
        if ($request->has('email')) {
            $user->email = $request->email;
        }
    
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }
    
        if ($request->has('role')) {
            $user->role = $request->role;
        }
    
        if ($request->has('department_id')) {
            $user->department_id = $request->department_id;
        }
    
        if ($request->has('username')) {
            $user->username = $request->username;
        }
    
        if ($request->has('phone')) {
            $user->phone = $request->phone;
        }
    
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if it exists
            if ($user->profile_picture && Storage::exists('public/' . $user->profile_picture)) {
                Storage::delete('public/' . $user->profile_picture);
            }
            // Store new profile picture
            $user->profile_picture = $request->file('profile_picture')->store('profile_pictures', 'public');
        }
    
        if ($request->has('base_salary')) {
            $user->base_salary = $request->base_salary;
        }
    
        $user->save();
    
        return response()->json([
            'message' => 'User updated successfully!',
            'user' => $user,
        ], 200);
    }
    
  



public function softDelete($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }
    $user->is_deleted = true;
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

}
