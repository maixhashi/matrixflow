import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlashMessage from '../Components/FlashMessage';
import '../../css/CreateMatrixFlowPage.css';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import CreateMatrixFlowPage from './CreateMatrixFlowPage';

const NewMatrixFlowPage = () => {
    const [workflowName, setWorkflowName] = useState('');
    const [flashMessage, setFlashMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [workflowId, setWorkflowId] = useState(null);

    useEffect(() => {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }, []);

    const handleCreateWorkflow = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await axios.post('/api/workflows', {
                name: workflowName
            }, {
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                maxRedirects: 0,
            });

            console.log('Response:', response.data);

            // 成功メッセージを設定
            setFlashMessage(`ワークフローを作成しました: ${response.data.name}`);

            // ワークフローのIDを設定
            const newWorkflowId = response.data.id;
            setWorkflowId(newWorkflowId);
            console.log('Workflow ID:', newWorkflowId);

        } catch (error) {
            if (error.response && error.response.status === 302) {
                window.location.href = error.response.headers.location;
            } else {
                console.error('Error creating workflow:', error);
                setFlashMessage('Failed to create workflow');
                setTimeout(() => setFlashMessage(''), 5000);
            }
        } finally {
            setIsSubmitting(false);
        }
    };
      
    return (
        <AuthenticatedLayout>
            <div className="welcome-container">
                <FlashMessage message={flashMessage} />
                {/* workflowIdがない場合はワークフロー作成フォームを表示 */}
                {!workflowId ? (
                    <form onSubmit={handleCreateWorkflow}>
                        <div className="form-group">
                            <label htmlFor="workflowName">ワークフロー名:</label>
                            <input
                                type="text"
                                id="workflowName"
                                value={workflowName}
                                onChange={(e) => setWorkflowName(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={isSubmitting}>フローを作成する</button>
                    </form>
                ) : (
                    // workflowIdが存在する場合はCreateMatrixFlowPageを表示
                    <CreateMatrixFlowPage workflowId={workflowId} />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default NewMatrixFlowPage;
