<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    // メンバー情報を取得するメソッド
    public function index()
    {
        // メンバー情報をすべて取得
        $members = Member::where('user_id', auth()->id())
        ->orderBy('order_on_matrix')
        ->get();


        // JSON形式で返す（Unicodeエスケープを無効にする）
        return response()->json($members, 200, [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
      }

    public function store(Request $request)
    {
        // バリデーション
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        // データの保存
        $member = new Member();
        $member->name = $request->input('name');
        $member->user_id = auth()->id(); // ログイン中のユーザーのIDを設定
        $member->save();
    
        return response()->json(['message' => 'Member created successfully!', 'member' => $member], 201);
    }
          
    public function saveOrder(Request $request)
    {
        // リクエストボディから member_ids を取得
        $memberIds = $request->input('member_ids');
    
        // デバッグ用: リクエストの内容を表示
        \Log::info('Received member_ids:', ['member_ids' => $memberIds]); // 修正
    
        // memberIds が null または配列でない場合にエラーメッセージを返す
        if (!$memberIds || !is_array($memberIds)) {
            return response()->json(['error' => 'Invalid data provided'], 400);
        }
    
        foreach ($memberIds as $order => $id) {
            // 各メンバーの order_on_matrix カラムを更新
            Member::where('id', $id)->update(['order_on_matrix' => $order]);
        }
    
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $member = Member::find($id);
        if ($member) {
            $member->delete();
            return response()->json(['success' => true], 200);
        }

        return response()->json(['success' => false, 'message' => 'Member not found.'], 404);
    }

    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);
        $member->name = $request->input('name');
        $member->save();

        return response()->json($member);
    }
}
