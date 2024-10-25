import React, { useState } from 'react';
import axios from 'axios';
import FlashMessage from '../Components/FlashMessage';
import '../../css/CreateMatrixFlowPage.css';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

const NewMatrixFlowPage = () => {
    const [workflowName, setWorkflowName] = useState('');
    const [flashMessage, setFlashMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
  
          // レスポンスデータをログに表示
          console.log('Response:', response.data); // ここを確認
          
          // ワークフローのIDを取得
          const workflowId = response.data.id; // ここでundefinedになっていないか確認
  
          // フラッシュメッセージを表示
          setFlashMessage('Workflow created successfully. You will be redirected.');
  
          // 自動的に遷移するためのタイマーをセット
          setTimeout(() => {
              window.location.href = `/create-matrixflow/${workflowId}`;
          }, 3000);
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
            </div>
        </AuthenticatedLayout>
    );
};

export default NewMatrixFlowPage;
