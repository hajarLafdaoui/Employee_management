<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Holiday;

class HolidayController extends Controller
{
    // Get all holidays
    public function index()
    {
        return response()->json(Holiday::all());
    }

    // Store a new holiday
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'date' => 'required|date'
        ]);

        $holiday = Holiday::create($validatedData);
        return response()->json($holiday, 201);
    }


    //holiday update
    public function update(Request $request, $id)
    {
        $holiday = Holiday::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required',
            'date' => 'required|date'
        ]);

        $holiday->update($validatedData);

        return response()->json($holiday, 200);
    }
    // Delete a holiday
    public function destroy($id)
    {
        $holiday = Holiday::findOrFail($id);
        $holiday->delete();
        return response()->json(null, 204);
    }
}
