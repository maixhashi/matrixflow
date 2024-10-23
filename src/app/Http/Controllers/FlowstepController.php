<?php

namespace App\Http\Controllers;

use App\Models\Flowstep;
use Illuminate\Http\Request;

class FlowstepController extends Controller
{
    public function index()
    {
        // ログイン中のユーザーが作成したフローステップと関連するメンバー情報を取得
        $flowsteps = Flowstep::with('members')
            -> where('user_id', auth()->id())
            ->get();
    
        return response()->json($flowsteps);
    }
    
    public function store(Request $request)
    {
        // バリデーション
        $request->validate([
            'name' => 'required|string',
            'flow_number' => 'required|integer',
            'member_id' => 'required|array', // 複数のメンバーIDを受け取れるように
            'member_id.*' => 'exists:members,id', // 各メンバーIDの存在確認
        ]);
    
        // FlowStepの作成（user_idを追加）
        $flowStep = FlowStep::create([
            'name' => $request->input('name'),
            'flow_number' => $request->input('flow_number'),
            'user_id' => auth()->id(), // ログイン中のユーザーのIDを設定
        ]);

        // FlowstepMemberに関連メンバーを追加
        foreach ($request->member_id as $memberId) {
           $flowStep->members()->attach($memberId);
        }

        return response()->json(['message' => 'Flow step added successfully', 'flowStep' => $flowStep]);
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

    public function getFlowstepWithMembers($flowstepId)
    {
        $flowstep = Flowstep::with('members')->find($flowstepId);

        if (!$flowstep) {
            return response()->json(['message' => 'Flowstep not found'], 404);
        }

        return response()->json($flowstep);
    }
    
}
