import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia'; // Inertia.js をインポート
import axios from 'axios'; // Axiosをインポート
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
            if (!token) {
              console.error('CSRF token not found');
            }

            const response = await axios.post('/api/workflows', {
                name: workflowName // 入力されたワークフロー名を送信
            }, {
                headers: {
                    'X-CSRF-TOKEN': token, // CSRFトークンをヘッダーに追加
                }
            });

            setWorkflowId(response.data.id); // 新しいワークフローIDを保存
            setFlashMessage(`Workflow created with ID: ${response.data.id}`);
            
            setTimeout(() => {
                setFlashMessage('');
                // Inertia.visit(`/create-matrixflow/${response.data.id}`);
                window.location.href = `/create-matrixflow/${response.data.id}`;
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
