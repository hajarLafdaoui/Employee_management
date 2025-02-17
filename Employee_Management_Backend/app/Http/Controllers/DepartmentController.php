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
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Ensure it's a valid image
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'description']);

        // Store the file path in database, Save the file inside storage/app/public/logos/
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('logos', 'public'); // Store in 'storage/app/public/logos'
        }

        $department = Department::create($data);

        return response()->json($department, 201);
    }

    // Laravel Controller Method
    public function update(Request $request, $id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $department->name = $request->input('name');
        $department->description = $request->input('description');

        if ($request->hasFile('logo')) {
            if ($department->logo) {
                Storage::delete('public/' . $department->logo);
            }
            $department->logo = $request->file('logo')->store('logos', 'public');
        }

        $department->save();

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
}
