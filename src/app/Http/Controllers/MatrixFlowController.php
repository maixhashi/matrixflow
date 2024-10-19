<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class MatrixFlowController extends Controller
{
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
