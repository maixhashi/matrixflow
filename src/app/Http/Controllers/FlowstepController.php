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
    
}
