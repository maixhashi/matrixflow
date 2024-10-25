<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
  public function store(Request $request)
  {
      $validatedData = $request->validate([
          'name' => 'required|string|max:255',
      ]);
  
      // ワークフローの作成
      $workflow = Workflow::create($validatedData);
  
      // 成功レスポンスを返す
      return response()->json([
          'id' => $workflow->id,
          'message' => 'Workflow created successfully.',
      ]);
  }
      
}
