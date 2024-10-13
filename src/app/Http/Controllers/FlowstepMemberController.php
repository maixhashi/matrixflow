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
          ]);

          // フローステップの割り当てを行う
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
