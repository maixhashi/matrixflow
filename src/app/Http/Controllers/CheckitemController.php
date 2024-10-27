<?php

namespace App\Http\Controllers;

use App\Models\Checkitem;
use Illuminate\Http\Request;

class CheckitemController extends Controller
{
    // CheckListに関連するCheckItemsの取得
    public function index($workflowId, $checklistId)
    {
        $checkItems = CheckItem::where('checklist_id', $checklistId)->get();
        return response()->json($checkItems);
    }

    // CheckItemの作成
    public function store(Request $request, $workflowId, $checklistId)
    {
        $checkItem = new CheckItem();
        $checkItem->checklist_id = $checklistId;
        $checkItem->name = $request->input('name');
        $checkItem->save();

        return response()->json($checkItem, 201);
    }

    // CheckItemの詳細取得
    public function show($workflowId, $checklistId, $id)
    {
        $checkItem = CheckItem::where('checklist_id', $checklistId)->findOrFail($id);
        return response()->json($checkItem);
    }

    // CheckItemの更新
    public function update(Request $request, $workflowId, $checklistId, $id)
    {
        $checkItem = CheckItem::where('checklist_id', $checklistId)->findOrFail($id);
        $checkItem->name = $request->input('name');
        $checkItem->save();

        return response()->json($checkItem);
    }

    // CheckItemの削除
    public function destroy($workflowId, $checklistId, $id)
    {
        $checkItem = CheckItem::where('checklist_id', $checklistId)->findOrFail($id);
        $checkItem->delete();

        return response()->json(['message' => 'CheckItem deleted successfully']);
    }
}
