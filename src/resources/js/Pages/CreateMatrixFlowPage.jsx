import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PDFViewer } from '@react-pdf/renderer';

// Redux Slice Storeの読み込み
import { fetchMembers } from '../store/memberSlice'; 
import { fetchFlowsteps, assignFlowStep } from '../store/flowstepsSlice'; 
import { openDocumentSettingsModal } from '../store/modalSlice';

// コンポーネントの読み込み
import MatrixView from '../Components/MatrixView';
import Document from '../Components/Document';
import ModalforDocumentSettings from '../Components/ModalforDocumentSettings';
import DocumentSettingsForm from '../Components/DocumentSettingsForm';
import FlashMessage from '../Components/FlashMessage';
import DocumentPDF from '../Components/DocumentPDF';

// Font Awesome アイコンの設定
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';


// スタイル
import '../../css/CreateMatrixFlowPage.css';

const CreateMatrixFlowPage = () => {
    const dispatch = useDispatch();
    const [membersUpdated, setMembersUpdated] = useState(false);
    const [flowstepsUpdated, setFlowstepsUpdated] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');
    const [showChecklists, setShowChecklists] = useState(true); 
    
    const flowsteps = useSelector((state) => state.flowsteps);
    const checklists = useSelector((state) => state.checkLists);
  
    const members = useSelector((state) => state.members);
    const { workflows, loading, error } = useSelector((state) => state.workflow);
    const isDocumentSettingsModalOpen = useSelector((state) => state.modal.isDocumentSettingsModalOpen);
    const showingChecklistsOnDocument = useSelector((state) => state.documentSettings.showingChecklistsOnDocument);
    const showingFlowstepDescriptionsOnDocument = useSelector((state) => state.documentSettings.showingFlowstepDescriptionsOnDocument);
    const PDFViewerMode = useSelector((state) => state.documentSettings.PDFViewerMode);
    const workflowId = useSelector((state) => state.workflow.workflowId);

    if (!workflowId) {
        return <div>Workflow IDがありません</div>;
      }
    

    useEffect(() => {
        dispatch(fetchMembers(workflowId));
        dispatch(fetchFlowsteps(workflowId));
    }, [dispatch, workflowId]);

    const handleMemberAdded = (member) => {
        const memberName = member.name || 'Unknown Member';
        setMembersUpdated(!membersUpdated);
        setFlashMessage(`メンバーを追加しました：${memberName}`);
        setTimeout(() => setFlashMessage(''), 5000);
    };
    
    const handleFlowStepAdded = () => {
        setFlowstepsUpdated(!flowstepsUpdated);
        setFlashMessage('フローステップを追加しました');
        setTimeout(() => setFlashMessage(''), 5000);
    };

    const handleAssignFlowStep = (memberId, flowstepId, assignedMembersBeforeDrop) => {
        dispatch(assignFlowStep({ memberId, flowstepId, assignedMembersBeforeDrop, workflowId }))
            .unwrap()
            .then(() => {
                const assignedMember = members.find(member => member.id === memberId);
                const memberName = assignedMember ? assignedMember.name : 'Unknown Member';
                setFlashMessage(`担当者を ${memberName} に変更しました。`);
                setMembersUpdated(prevState => !prevState);
                setFlowstepsUpdated(prevState => !prevState);
            })
            .catch((error) => {
                console.error('Error assigning FlowStep:', error);
                setFlashMessage("Failed to assign FlowStep");
            });

        setTimeout(() => setFlashMessage(''), 5000);
        dispatch(fetchFlowsteps(workflowId));
    };
    
    const handleOpenDocumentSettingsModal = () => {
        dispatch(openDocumentSettingsModal());
    }
    

    return (
        <div>
            <FlashMessage message={flashMessage} />
            <div className="content-container">
            { !PDFViewerMode && (
                <div className="sidebar">
                    <Document 
                        workflowId={workflowId}
                    />
                </div>
            )} 
            { PDFViewerMode && (
                <div className="sidebar-on-PDFViewerMode">
                    <div className="settings-button">
                        <button onClick={handleOpenDocumentSettingsModal}>
                           <FontAwesomeIcon icon={faCog} />
                         </button>
                     </div>

                    <PDFViewer style={{ width: '100%', height: '80vh' }}>
                      <DocumentPDF
                        workflowId={workflowId}
                        workflows={workflows}
                        flowsteps={flowsteps}
                        checklists={checklists}
                        showingChecklistsOnDocument={showingChecklistsOnDocument}
                        showingFlowstepDescriptionsOnDocument={showingFlowstepDescriptionsOnDocument}
                      />
                    </PDFViewer>
                </div>
            )}
                <div className="main-content">
                    <MatrixView
                        members={members}
                        flowsteps={flowsteps}
                        onAssignFlowStep={handleAssignFlowStep}
                        onMemberAdded={handleMemberAdded}
                        onFlowStepAdded={handleFlowStepAdded}
                        workflowId={workflowId}
                    />

                    {isDocumentSettingsModalOpen && (
                        <ModalforDocumentSettings>
                            <DocumentSettingsForm
                                showChecklists={showChecklists} 
                                showingFlowstepDescriptionsOnDocument={showingFlowstepDescriptionsOnDocument}
                            />
                        </ModalforDocumentSettings>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateMatrixFlowPage;
