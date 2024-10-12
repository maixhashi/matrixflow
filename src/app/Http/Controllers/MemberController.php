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
        $members = Member::all();

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
        $member->save();

        return response()->json(['message' => 'Member created successfully!', 'member' => $member], 201);
    }       
}
