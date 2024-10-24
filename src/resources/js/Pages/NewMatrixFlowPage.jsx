import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia'; // Inertia.js をインポート
import FlashMessage from '../Components/FlashMessage';
import '../../css/CreateMatrixFlowPage.css';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

const NewMatrixFlowPage = () => {
    const [workflowName, setWorkflowName] = useState(''); // ワークフロー名の状態
    const [workflowId, setWorkflowId] = useState(null);   // 新しいワークフローIDを保存する状態
    const [flashMessage, setFlashMessage] = useState(''); // フラッシュメッセージ用の状態

    const handleCreateWorkflow = async (event) => {
        event.preventDefault(); // フォームのデフォルトの送信を防ぐ

        try {
            // LaravelのCSRFトークンをmetaタグから取得
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
            const response = await fetch('/api/workflows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token, // CSRFトークンをヘッダーに追加
                },
                body: JSON.stringify({ name: workflowName }), // 入力されたワークフロー名を送信
            });
            
            if (!response.ok) {
                throw new Error('Failed to create workflow');
            }

            const data = await response.json();
            setWorkflowId(data.id); // 新しいワークフローIDを保存
            setFlashMessage(`Workflow created with ID: ${data.id}`);
            
            setTimeout(() => {
                setFlashMessage('');
                Inertia.visit(`/create-matrixflow/${data.id}`);
            }, 3000); // 3秒後に遷移
        } catch (error) {
            console.error('Error creating workflow:', error);
            setFlashMessage('Failed to create workflow');
            setTimeout(() => setFlashMessage(''), 5000);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="welcome-container">
                <FlashMessage message={flashMessage} />
                <form onSubmit={handleCreateWorkflow}>
                    <div className="form-group">
                        <label htmlFor="workflowName">ワークフロー名:</label>
                        <input
                            type="text"
                            id="workflowName"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)} // 入力値を状態にセット
                            required
                        />
                    </div>
                    <button type="submit">フローを作成する</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default NewMatrixFlowPage;
