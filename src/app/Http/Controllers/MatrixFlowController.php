<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class MatrixFlowController extends Controller
{
    // ページ遷移
    public function renderNewMatrixFlowPage()
    {
        // Inertia::render を使ってフロントエンドにデータとページを送る
        return Inertia::render('NewMatrixFlowPage', [
            'flowData' => 'Sample data for the matrix flow',
        ]);
    }

    public function renderCreateMatrixFlowPage($workflowId)
    {
        return Inertia::render('CreateMatrixFlowPage', [
            'workflowId' => $workflowId,
        ]);
    }
        
    public function renderCreateMatrixFlowPageforGuest()
    {
        // Inertia::render を使ってフロントエンドにデータとページを送る
        return Inertia::render('CreateMatrixFlowPageforGuest', [
            'flowData' => 'Sample data for the matrix flow',
        ]);
    }
}
