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
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'salary' => 'required|numeric',
        ]);

        return Job::create($request->all());
    }

    public function show(Job $job)
    {
        return $job->load('department');
    }
}
