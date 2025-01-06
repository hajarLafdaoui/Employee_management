<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Container\Attributes\Storage;
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
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
    
        // Handle the uploaded profile picture
        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            // Store the file in the 'public/profile_pictures' directory
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
            'profile_picture' => $profilePicturePath,  // Save the file path
         
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
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Added validation for image
        ]);
    
        // Handle the uploaded profile picture (if any)
        if ($request->hasFile('profile_picture')) {
            // Delete the old profile picture if it exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
    
            // Store the new profile picture and update the path
            $profilePicturePath = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->profile_picture = $profilePicturePath;
        }
    
        // Update other fields
        $user->name = $validatedData['name'] ?? $user->name;
        $user->email = $validatedData['email'] ?? $user->email;
    
        if (isset($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }
    
        $user->role = $validatedData['role'] ?? $user->role;
        $user->department_id = $validatedData['department_id'] ?? $user->department_id;
        $user->username = $validatedData['username'] ?? $user->username;
        $user->phone = $validatedData['phone'] ?? $user->phone;
    
        // Save the user with updated data
        $user->save();
    
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ], 200);
    }
    

    // // Delete user by ID
    // public function destroy($id)
    // {
    //     $user = User::find($id);

    //     if (!$user) {
    //         return response()->json(['message' => 'User not found'], 404);
    //     }

    //     $user->delete();

    //     return response()->json(['message' => 'User deleted successfully']);
    // }

public function toggleStatus($id){
    $user=User::find($id);
    if(!$user){
        return response()->json(['message'=>'user not found']);
    }
    $user->status=($user->status==='enabled')?'disabled':'enabled';
    $user->save();
    return response()->json([
        'message'=>'user status updated sucessfuly',
        'user'=>$user
    ],200);
}


}
