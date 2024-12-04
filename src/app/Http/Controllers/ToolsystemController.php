<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flowstep;
use App\Models\Toolsystem;
use Illuminate\Support\Facades\Log;


class ToolsystemController extends Controller
{
    public function index(Flowstep $flowstep)
    {
        return response()->json($flowstep->toolsystems);
    }

    public function store(Request $request, Flowstep $flowstep)
    {
        $validated = $request->validate([
            'toolsystemName' => 'string|required',
        ]);

        $toolsystem = Toolsystem::firstOrCreate(['name' => $validated['toolsystemName']]);
        $flowstep->toolsystems()->syncWithoutDetaching([$toolsystem->id]);

        return response()->json([
            'message' => 'Tool added successfully',
            'toolsystems' => $flowstep->toolsystems()->get(),
        ]);
    }


    public function update(Request $request, Flowstep $flowstep, $toolsystemId)
    {
        Log::debug('Received Request:', $request->all());  // リクエストデータをログに記録
    
        $validated = $request->validate([
            'toolsystemName' => 'string|required',
        ]);
    
        Log::debug('Validated Data:', $validated);  // バリデーション後のデータをログに記録
    
        // Flowstepに関連するツールシステムをtoolsystemIdで取得
        $toolsystem = $flowstep->toolsystems()->find($toolsystemId);
    
        if ($toolsystem) {
            Log::debug('Found ToolSystem:', $toolsystem->toArray());  // ツールシステムが見つかった場合、データをログに記録
    
            // 既存のツールシステムの名前を更新
            $toolsystem->update(['name' => $validated['toolsystemName']]);
        } else {
            Log::warning('ToolSystem Not Found', ['toolsystemId' => $toolsystemId]);  // ツールシステムが見つからない場合、警告ログ
            return response()->json([
                'message' => 'Toolsystem not found.',
            ], 404);
        }
    
        Log::debug('Updated ToolSystem:', $toolsystem->toArray());  // 更新後のツールシステムのデータをログに記録
    
        return response()->json([
            'message' => 'Tool updated successfully',
            'toolsystems' => $flowstep->toolsystems()->get(),
        ]);
    }
            
    public function destroy(Flowstep $flowstep, Toolsystem $toolsystem)
    {
        $flowstep->toolsystems()->detach($toolsystem->id);

        return response()->json([
            'message' => 'Tool removed successfully',
        ]);
    }
}
