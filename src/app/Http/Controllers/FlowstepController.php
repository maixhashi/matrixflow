<?php

namespace App\Http\Controllers;

use App\Models\Flowstep;
use Illuminate\Http\Request;

class FlowstepController extends Controller
{
    // 全てのフローステップを取得する
    public function index()
    {
        $flowsteps = Flowstep::all();
        return response()->json($flowsteps);
    }

    // 新しいフローステップを作成する
    public function store(Request $request)
    {
        // バリデーション
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'flow_number' => 'nullable|integer',
        ]);

        // 新しいフローステップの作成
        $flowstep = Flowstep::create([
            'name' => $validatedData['name'],
            'flow_number' => $validatedData['flow_number'] ?? null,
        ]);

        return response()->json($flowstep, 201);  // 作成したデータを返す
    }
}
