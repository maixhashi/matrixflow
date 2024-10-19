<?php

namespace App\Http\Controllers;

use App\Models\Flowstep;
use Illuminate\Http\Request;

class FlowstepController extends Controller
{
    public function index()
    {
        // 各フローステップに関連するメンバー情報も取得する
        $flowsteps = Flowstep::with('members')->get();
        return response()->json($flowsteps);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'flow_number' => 'required|integer',
            'member_id' => 'required|array', // 複数のメンバーIDを受け取れるように
            'member_id.*' => 'exists:members,id', // 各メンバーIDの存在確認
        ]);
    
        // FlowStepの作成
        $flowStep = FlowStep::create($request->only(['name', 'flow_number']));
    
        // FlowstepMemberに関連メンバーを追加
        foreach ($request->member_id as $memberId) {
            $flowStep->members()->attach($memberId);
        }
    
        return response()->json(['message' => 'Flow step added successfully']);
    }

    public function updateFlowstepStepnumber(Request $request)
    {
        $request->validate([
            'flowStepId' => 'required|integer',
            'newFlowNumber' => 'required|integer',
        ]);

        $flowStep = FlowStep::findOrFail($request->flowStepId);
        $flowStep->flow_number = $request->newFlowNumber;
        $flowStep->save();

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $flowStep = FlowStep::find($id);
        
        if (!$flowStep) {
            return response()->json(['error' => 'Flow step not found'], 404);
        }
        
        $flowStep->delete();
        return response()->json(['message' => 'Flow step deleted successfully'], 200);
    }

    public function update(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Find the FlowStep and update it
        $flowStep = FlowStep::findOrFail($id);
        $flowStep->name = $request->input('name');
        $flowStep->save();

        return response()->json($flowStep, 200); // Return updated flow step
    }
    
}
