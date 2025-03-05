<?php
namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

    public function update(Request $request, Job $job)
{
    // Debugging request data
    Log::debug($request->all());

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'salary' => 'required|numeric|min:0',
        'department_id' => 'required|exists:departments,id'
    ]);
    
    $job->update($request->all());

    // Check if update was successful
    Log::debug('Job updated:', $job->toArray());

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
