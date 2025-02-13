<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DepartmentController extends Controller
{
    public function index()
    {
        return Department::with('jobs')->get();
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

public function destroy($id){
    $department = Department::find($id);
    $department->delete();
}
public function update(Request $request, $id)
{
    dd($request->all()); // Debugging: Voir les données reçues

    $department = Department::findOrFail($id);

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    $department->name = $request->name;
    $department->description = $request->description;

    if ($request->hasFile('logo')) {
        if ($department->logo) {
            Storage::delete('public/logos/' . $department->logo);
        }
        $logoPath = $request->file('logo')->store('public/logos');
        $department->logo = basename($logoPath);
    }

    $department->save();

    return response()->json(['message' => 'Department updated successfully!', 'department' => $department]);
}


    public function show(Department $department)
    {
        return $department->load('jobs');
    }
}
