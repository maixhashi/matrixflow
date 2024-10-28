import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWorkflow, clearFlashMessage } from '../store/workflowSlice';
import FlashMessage from '../Components/FlashMessage';
import '../../css/NewMatrixFlowPage.css';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import CreateMatrixFlowPage from './CreateMatrixFlowPage';


const WorkflowForm = () => {
    const [workflowName, setWorkflowName] = useState('');
    const dispatch = useDispatch();
    const { isSubmitting, flashMessage } = useSelector((state) => state.workflow);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                dispatch(clearFlashMessage());
            }, 5000);
            return () => clearTimeout(timer); // クリーンアップ
        }
    }, [flashMessage, dispatch]);

    const handleCreateWorkflow = (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        dispatch(createWorkflow(workflowName));
        setWorkflowName(''); // フォームをクリア
    };

    return (
        <form onSubmit={handleCreateWorkflow} className="form-container">
            <input 
                type="text" 
                value={workflowName} 
                onChange={(e) => setWorkflowName(e.target.value)} 
                required 
                placeholder="ワークフロー名" 
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '作成中...' : 'ワークフロー作成'}
            </button>
            {flashMessage && <div>{flashMessage}</div>}
        </form>
    );
};


const NewMatrixFlowPage = () => {
    const dispatch = useDispatch();
    const { workflowId, flashMessage } = useSelector((state) => state.workflow);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                dispatch(clearFlashMessage());
            }, 5000);
            return () => clearTimeout(timer); // クリーンアップ
        }
    }, [flashMessage, dispatch]);

    return (
        <AuthenticatedLayout>
            <div className="NewMatrixFlowe-container">
                <FlashMessage message={flashMessage} />
                {/* workflowIdがない場合はワークフロー作成フォームを表示 */}
                {!workflowId ? (
                    <WorkflowForm />
                ) : (
                    // workflowIdが存在する場合はCreateMatrixFlowPageを表示
                    <CreateMatrixFlowPage workflowId={workflowId} />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default NewMatrixFlowPage;