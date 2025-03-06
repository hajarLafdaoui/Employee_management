<?php
namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index()
    {
        return Job::with('department')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'salary' => 'required|numeric|min:0',
            'department_id' => 'required|exists:departments,id'
        ]);
    
        $job = Job::create($request->all());
        return response()->json($job, 201);
    }

    public function update(Request $request, $id)
    {
        // Find the job by ID
        $job = Job::find($id);
    
        // If the job doesn't exist, return a 404 error
        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }
    
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'salary' => 'required|numeric',
            'department_id' => 'required|exists:departments,id', // Ensure the department exists
        ]);
    
        // Update the job fields
        $job->name = $request->input('name');
        $job->description = $request->input('description');
        $job->salary = $request->input('salary');
        $job->department_id = $request->input('department_id');
    
        // Save the updated job
        $job->save();
    
        // Return the updated job as a JSON response
        return response()->json($job);
    }

    public function destroy($id)
    {
        // Find the job by ID
        $job = Job::find($id);
        
        // If the job exists, delete it and return a success response
        if ($job) {
            $job->delete();
            return response()->json(['message' => 'Job deleted successfully']);
        }
        
        // If the job doesn't exist, return an error response
        return response()->json(['message' => 'Job not found'], 404);
    }
    
}
