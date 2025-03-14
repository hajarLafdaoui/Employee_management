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

    // Store a new user
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
            'profile_picture' => 'nullable|string', // Expect base64 encoded image
            // 'base_salary' => 'required|numeric|min:0',
            'gender' => 'required|in:male,female',
            'country' => 'nullable|string|max:255',
            'is_active' => 'boolean', // Assuming 'status' is boolean for active/inactive
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $profilePicturePath = null;
        if ($request->has('profile_picture')) {
            $profilePicturePath = $this->handleBase64Image($request->input('profile_picture'));
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
            // 'base_salary' => $request->base_salary,
            'gender' => $request->gender,
            'country' => $request->country,
            'is_active' => $isLoggedIn,  // Set to true only if the user is logged in
        ]);

        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user,
        ], 201);
    }

    // Update an existing user

    /**
     * Handle base64 image upload.
     *
     * @param string $base64Image
     * @param string|null $oldImagePath
     * @return string|null
     */

     public function update(Request $request, $id)
     {
         $validator = Validator::make($request->all(), [
             'name' => 'required|string|max:255',
             'email' => 'required|email|unique:users,email,' . $id,
             'username' => 'required|string|max:255|unique:users,username,' . $id,
             'gender' => 'required|in:male,female',
             'phone' => 'nullable|string|max:255',
             'country' => 'nullable|string|max:255',
             'department_id' => 'required|exists:departments,id',
             'profile_picture' => 'nullable|string', // Expect base64 encoded image
         ]);
     
         if ($validator->fails()) {
             return response()->json([
                 'message' => 'Validation failed',
                 'errors' => $validator->errors(),
             ], 422);
         }
     
         $user = User::find($id);
         if (!$user) {
             return response()->json(['message' => 'User not found'], 404);
         }
     
         $profilePicturePath = $user->profile_picture;
         if ($request->has('profile_picture')) {
             $profilePicturePath = $this->handleBase64Image($request->input('profile_picture'), $profilePicturePath);
         }
     
         $user->update([
             'name' => $request->name,
             'email' => $request->email,
             'username' => $request->username,
             'gender' => $request->gender,
             'phone' => $request->phone,
             'country' => $request->country,
             'department_id' => $request->department_id,
             'profile_picture' => $profilePicturePath,
         ]);
     
         return response()->json([
             'message' => 'User updated successfully',
             'user' => $user,
         ]);
     }
    private function handleBase64Image($base64Image, $oldImagePath = null)
    {
        if (!$base64Image) {
            return null;
        }

        // Decode the base64 image
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

        // Generate a unique filename
        $extension = 'png'; // Default extension (you can detect it from the base64 string if needed)
        $filename = 'profile_pictures/' . uniqid() . '.' . $extension;

        // Save the image to storage
        Storage::disk('public')->put($filename, $imageData);

        // Delete the old image if it exists
        if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return $filename;
    }

    // Soft delete a user
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

    // Get user notifications
    public function getUserNotifications(Request $request)
    {
        return response()->json($request->user()->notifications);
    }

    // Update user status (active or inactive)
    public function updateStatus(Request $request, $userId)
    {
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

    // Change user password
    public function changePassword(Request $request)
    {
        $user = $request->user(); // Get the authenticated user

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Validate the input
        $validator = Validator::make($request->all(), [
            'old_password' => 'required|string|min:8',
            'new_password' => 'required|string|min:8|confirmed', // Ensure 'new_password' and 'confirm_password' match
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check if the old password matches
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Old password is incorrect'], 400);
        }

        // Update the password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }
}