import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlashMessage from '../Components/FlashMessage';
import '../../css/NewMatrixFlowPage.css';
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

    const handleCreateWorkflow = (event) => {
      event.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
  
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
      axios.post('/api/workflows', {
          name: workflowName
      }, {
          headers: {
              'X-CSRF-TOKEN': token,
          },
          maxRedirects: 0,
      })
      .then(response => {
          console.log('Response:', response.data);
  
          // 成功メッセージを設定
          setFlashMessage(`ワークフローを作成しました: ${response.data.name}`);
          setTimeout(() => {
              setFlashMessage('');
              console.log('Flash message cleared');
          }, 5000);
  
          // ワークフローのIDを設定
          const newWorkflowId = response.data.id;
          setWorkflowId(newWorkflowId);
          console.log('Workflow ID:', newWorkflowId);
      })
      .catch(error => {
          if (error.response && error.response.status === 302) {
              window.location.href = error.response.headers.location;
          } else {
              console.error('Error creating workflow:', error);
              setFlashMessage('Failed to create workflow');
              setTimeout(() => setFlashMessage(''), 5000);
          }
      })
      .finally(() => {
          setIsSubmitting(false);
      });
  };
        
    return (
        <AuthenticatedLayout>
            <div className="NewMatrixFlowe-container">
                <FlashMessage message={flashMessage} />
                {/* workflowIdがない場合はワークフロー作成フォームを表示 */}
                {!workflowId ? (
                    <form onSubmit={handleCreateWorkflow} className="form-container">
                        <div>
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
