<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
    // メンバー情報を取得するメソッド
    public function index()
    {
        // Get all members for the specified workflow and the logged-in user
        $workflows = Workflow::where('user_id', auth()->id())
            ->get();
    
        // JSON response
        return response()->json($workflows, 200, [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    public function fetch_workflow($workflowId)
    {
        // Get all members for the specified workflow and the logged-in user
        $workflow = Workflow::findOrFail($workflowId)
            ->get();
    
        // JSON response
        return response()->json($workflow, 200, [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
  
  public function store(Request $request)
  {
    // Validate the input
    $request->validate([
      'name' => 'required|string|max:255',
    ]);

    // Save the member data
    $workflow = new Workflow();
    $workflow->name = $request->input('name');
    $workflow->user_id = auth()->id(); // Set the logged-in user's ID
    $workflow->save();
  
    // 成功レスポンスを返す
    return response()->json([
        'id' => $workflow->id,
        'name' => $workflow->name,
        'message' => 'Workflow created successfully.',
    ]);
  }

  public function show($id)
  {
      $workflow = Workflow::findOrFail($id);
      return Inertia::render('WorkflowDetailPage', [
          'workflow' => $workflow
      ]);
  }
      
}
