<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
    // 新しいワークフローを作成するメソッド
    public function store(Request $request)
    {
        // バリデーション (名前フィールドが必須など)
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // ワークフローを作成
        $workflow = Workflow::create([
            'name' => $request->input('name'),
        ]);

        // 作成したワークフローのIDを返す
        return response()->json(['id' => $workflow->id], 201);
    }
}
