<?php

namespace App\Http\Controllers;

use App\Models\Flowstep;
use App\Models\Workflow;
use Illuminate\Http\Request;

class FlowstepController extends Controller
{
    // メンバー情報を取得するメソッド
    public function index($workflowId)
    {
        $flowsteps = Flowstep::with('members')->where('workflow_id', $workflowId)->get();
        // JSON response
        return response()->json($flowsteps, 200, [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
    
    public function store(Request $request, $workflowId)
    {
        // バリデーション
        $request->validate([
            'name' => 'required|string',
            'flow_number' => 'required|integer',
            'member_id' => 'required|array', // 複数のメンバーIDを受け取れるように
            'member_id.*' => 'exists:members,id', // 各メンバーIDの存在確認
        ]);

        // Check if the workflow exists (optional)
        $workflow = Workflow::find($workflowId);
        if (!$workflow) {
            return response()->json(['message' => 'Workflow not found'], 404);
        }

        // Save the member data
        $flowstep = new Flowstep();
        $flowstep->name = $request->input('name');
        $flowstep->flow_number = $request->input('flow_number');
        $flowstep->user_id = auth()->id(); // Set the logged-in user's ID
        $flowstep->workflow_id = $workflowId; // Associate member with workflow
        $flowstep->save();
    
        // FlowstepMemberに関連メンバーを追加
        foreach ($request->member_id as $memberId) {
           $flowstep->members()->attach($memberId);
        }

        return response()->json(['message' => 'Flow step added successfully', 'flowStep' => $flowstep]);
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
            'flow_number' => 'required|integer'
        ]);

        // Find the FlowStep and update it
        $flowStep = FlowStep::findOrFail($id);
        $flowStep->name = $request->input('name');
        $flowStep->flow_number = $request->input('flow_number');
        $flowStep->save();

        return response()->json($flowStep, 200); // Return updated flow step
    }

    public function updateName(Request $request, $id)
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
