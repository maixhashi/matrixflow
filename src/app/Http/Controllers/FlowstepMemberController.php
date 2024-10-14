<?php

namespace App\Http\Controllers;

use App\Models\FlowstepMember; // 中間テーブルモデル
use Illuminate\Http\Request;

class FlowstepMemberController extends Controller
{

  public function store(Request $request)
  {
      try {
          $request->validate([
              'memberId' => 'required|exists:members,id',
              'flowstepId' => 'required|exists:flowsteps,id',
              'assignedMembersBeforeDrop' => 'array', // ドロップ前のメンバーのリストを検証
              'assignedMembersBeforeDrop.*' => 'exists:members,id', // 各IDが有効であることを検証
          ]);

          // ドロップ前のメンバー関連を削除する
          if ($request->has('assignedMembersBeforeDrop')) {
              FlowstepMember::where('flowstep_id', $request->flowstepId)
                  ->whereIn('member_id', $request->assignedMembersBeforeDrop)
                  ->delete();
          }

          // 新しいメンバー関連付けを作成または更新
          FlowstepMember::updateOrCreate(
              ['member_id' => $request->memberId, 'flowstep_id' => $request->flowstepId]
          );

          return response()->json(['message' => 'FlowStep assigned successfully']);
      } catch (\Exception $e) {
          \Log::error($e->getMessage()); // エラーログに記録
          return response()->json(['error' => 'Failed to assign FlowStep'], 500);
      }
  }

}
