<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DepartmentController extends Controller
{
       // For the chart (BarChart)
       public function getEmployeeCountByDepartment()
       {
           // Fetch department names
           $departments = Department::all();
       
           // Initialize an array to hold the department-wise employee count
           $numberOfEmployeesInEachDep = [];
       
           // Iterate over each department and count the number of employees
           foreach ($departments as $department) {
               $employeeCount = User::where('department_id', $department->id)->count();
               
               // Add the department name and employee count to the result array
               $numberOfEmployeesInEachDep[] = [
                   'department' => $department->name,  // or any other department identifier you want to show
                   'employee_count' => $employeeCount,
               ];
           }
       
           // Return the result as a JSON response
           return response()->json($numberOfEmployeesInEachDep);
       }
       
       
    public function index()
    {
        return Department::with('jobs')->get();
    }

    public function getEmployeesByDepartment($department_id)
    {
        // Fetch employees based on department_id
        $employees = User::where('department_id', $department_id)->get();

        // Return the data (you can modify it as needed)
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'logo' => 'nullable|string', // Expect base64 encoded image
        ]);
    
        $logoPath = null;
        if ($request->has('logo')) {
            // Decode the base64 image
            $logoData = $request->input('logo');
            $extension = explode('/', mime_content_type($logoData))[1]; // Get extension from mime type
            $logoData = str_replace('data:image/' . $extension . ';base64,', '', $logoData);
            $logoData = base64_decode($logoData);
    
            // Generate unique filename for the image
            $logoPath = 'logos/' . uniqid() . '.' . $extension;
    
            // Store the image in storage
            Storage::disk('public')->put($logoPath, $logoData);
        }
    
        $department = Department::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'logo' => $logoPath,
        ]);
    
        return response()->json($department);
    }
    
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
    
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'logo' => 'nullable|string', // Expect base64 encoded image
        ]);
    
        $logoPath = $department->logo;
        if ($request->has('logo')) {
            // Decode the base64 image
            $logoData = $request->input('logo');
            $extension = explode('/', mime_content_type($logoData))[1]; // Get extension from mime type
            $logoData = str_replace('data:image/' . $extension . ';base64,', '', $logoData);
            $logoData = base64_decode($logoData);
    
            // Delete the old logo if a new one is uploaded
            if ($logoPath) {
                Storage::delete('public/' . $logoPath);
            }
    
            // Generate unique filename for the image
            $logoPath = 'logos/' . uniqid() . '.' . $extension;
    
            // Store the image in storage
            Storage::disk('public')->put($logoPath, $logoData);
        }
    
        $department->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'logo' => $logoPath,
        ]);
    
        return response()->json($department);
    }
    
    public function destroy($id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        // Delete related jobs if necessary
        $department->jobs()->delete();

        $department->delete();
        return response()->json(['message' => 'Department deleted successfully']);
    }

    public function show(Department $department)
    {
        return $department->load('jobs');
    }

    public function getJobsByDepartment($departmentId)
{
    // Fetch jobs for the selected department
    $jobs = Job::where('department_id', $departmentId)->get();

    // Return the jobs as a JSON response
    return response()->json($jobs);
}
}
