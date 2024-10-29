<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    // 指定したworkflowに関連するChecklistの取得
    public function index($workflowId)
    {
        $checklists = Checklist::where('workflow_id', $workflowId)->get();
        return response()->json($checklists);
    }

    public function store(Request $request, $workflowId)
    {
        // リクエストからデータを取得
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'flownumber_for_checklist' => 'required|integer',
        ]);
    
        $checklist = new Checklist();
        $checklist->workflow_id = $workflowId;
        $checklist->name = $data['name']; // 修正: $dataからnameを取得
        $checklist->flownumber_for_checklist = $data['flownumber_for_checklist']; // 修正: $dataからflownumber_for_checklistを取得
        $checklist->save();
    
        return response()->json($checklist, 201);
    }
    
    // Checklistの詳細取得
    public function show($workflowId, $id)
    {
        $checklist = Checklist::where('workflow_id', $workflowId)->findOrFail($id);
        return response()->json($checklist);
    }

    // Checklistの更新
    public function update(Request $request, $workflowId, $id)
    {
        $checklist = Checklist::where('workflow_id', $workflowId)->findOrFail($id);
        $checklist->name = $request->input('name');
        $checklist->flownumber_for_checklist = $data['flownumber_for_checklist'];
        $checklist->save();

        return response()->json($checklist);
    }

    // Checklistの削除
    public function destroy($workflowId, $id)
    {
        $checklist = Checklist::where('workflow_id', $workflowId)->findOrFail($id);
        $checklist->delete();

        return response()->json(['message' => 'Checklist deleted successfully']);
    }
}
