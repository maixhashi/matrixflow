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

    public function renderCreateMatrixFlowPage()
    {
        // Inertia::render を使ってフロントエンドにデータとページを送る
        return Inertia::render('CreateMatrixFlowPage', [
            'flowData' => 'Sample data for the matrix flow',
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
