<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flowstep;
use App\Models\Toolsystem;

class ToolsystemController extends Controller
{
    public function index(Flowstep $flowstep)
    {
        return response()->json($flowstep->toolsystems);
    }

    public function store(Request $request, Flowstep $flowstep)
    {
        $validated = $request->validate([
            'toolsystemName' => 'string|required',
        ]);

        $toolsystem = Toolsystem::firstOrCreate(['name' => $validated['toolsystemName']]);
        $flowstep->toolsystems()->syncWithoutDetaching([$toolsystem->id]);

        return response()->json([
            'message' => 'Tool added successfully',
            'toolsystems' => $flowstep->toolsystems()->get(),
        ]);
    }

    public function update(Request $request, Flowstep $flowstep)
    {
        $validated = $request->validate([
            'toolsystem_ids' => 'array|required',
            'toolsystem_ids.*' => 'exists:toolsystems,id',
        ]);

        $flowstep->toolsystems()->sync($validated['toolsystem_ids']);

        return response()->json([
            'message' => 'Tools updated successfully',
            'toolsystems' => $flowstep->toolsystems()->get(),
        ]);
    }

    public function destroy(Flowstep $flowstep, Toolsystem $toolsystem)
    {
        $flowstep->toolsystems()->detach($toolsystem->id);

        return response()->json([
            'message' => 'Tool removed successfully',
        ]);
    }
}
