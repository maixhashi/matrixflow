import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Redux Slice Storeの参照
import { fetchFlowsteps } from '../store/flowstepsSlice';
import { fetchCheckLists, updateChecklist, deleteChecklist } from '../store/checklistSlice';
import { fetchWorkflow } from '../store/workflowSlice';
import { openDocumentSettingsModal } from '../store/modalSlice';

// Font Awesome アイコンの設定
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faEdit, faSave, faCancel, faTrash, faCog } from '@fortawesome/free-solid-svg-icons';

// スタイル
import '../../css/Document.css';

const Document = ({ workflowId }) => {
  const dispatch = useDispatch();
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [updatedChecklistName, setUpdatedChecklistName] = useState('');

  const { workflows, loading, error } = useSelector((state) => state.workflow);
  const flowsteps = useSelector((state) => state.flowsteps);
  const checklists = useSelector((state) => state.checkLists);
  const showingChecklistsOnDocument = useSelector((state) => state.documentSettings.showingChecklistsOnDocument);
  const showingFlowstepDescriptionsOnDocument = useSelector((state) => state.documentSettings.showingFlowstepDescriptionsOnDocument);

  useEffect(() => {
    dispatch(fetchFlowsteps(workflowId));
    dispatch(fetchCheckLists(workflowId));
    dispatch(fetchWorkflow(workflowId));
  }, [dispatch, workflowId]);

  if (loading) {
    return <div>ローディング中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>エラー: {error}</div>;
  }

  const handleEditClick = (checklist) => {
    setEditingChecklist(checklist.id);
    setUpdatedChecklistName(checklist.name);
  };
  
  const handleSaveClick = (checklist) => {
    dispatch(updateChecklist({
      workflowId,
      checklistId: checklist.id,
      updatedData: { name: updatedChecklistName }
    }));
    setEditingChecklist(null);
    dispatch(fetchCheckLists(workflowId));
  };

  const handleDeleteClick = (checklist) => {
    dispatch(deleteChecklist({
      checklistId: checklist.id,
    }));
  };

  const workflowName = workflows[0]?.name;

  const handleOpenDocumentSettingsModal = () => {
    dispatch(openDocumentSettingsModal());
  }

  return (
    <div className="document-container">
      <div className="settings-button">
        <button onClick={handleOpenDocumentSettingsModal}>
          <FontAwesomeIcon icon={faCog} />
        </button>
      </div>
      <div className="document-title">
        {workflowName ? workflowName : 'ワークフローが見つかりません。'}
      </div>

      {flowsteps.length === 0 ? (
        <p>フローステップはまだありません。</p>
      ) : (
        flowsteps.map((flowstep, index) => {
          const flowstepChecklists = checklists[flowstep.flow_number] || [];

          return (
            <div key={flowstep.id}>
              <div className="chapter">{index + 1}: {flowstep.name}</div>
              <div className="content">
                <div className="main-content">
                  {flowstep.members && flowstep.members.length > 0
                    ? `${flowstep.members.map(member => member.name).join(', ')} は${flowstep.name}を行う。`
                    : 'Unknown Member が行うタスク:'}
                </div>
                {showingFlowstepDescriptionsOnDocument && (
                  <div className="flowstep-description-content">
                    {flowstep.description}
                  </div>
                )}
              </div>

              {showingChecklistsOnDocument && ( // showChecklists の状態で表示を切り替え
                <div className="checklist-container-card">
                  <div className="checklist-title">チェック項目</div>
                  {flowstepChecklists.length > 0 ? (
                    <ul className="checklist-container">
                      {flowstepChecklists.map((checklist) => (
                        <li key={checklist.id} className="checklist-card">
                          <FontAwesomeIcon icon={faClipboardCheck} className="icon-on-checklist-card" />
                          {editingChecklist === checklist.id ? (
                            <div>
                              <input
                                type="text"
                                value={updatedChecklistName}
                                onChange={(e) => setUpdatedChecklistName(e.target.value)}
                              />
                              <button onClick={() => handleSaveClick(checklist)}>
                                <FontAwesomeIcon icon={faSave} className="faSave-icon-on-checklist-card" />
                              </button>
                              <button onClick={() => setEditingChecklist(null)}>
                                <FontAwesomeIcon icon={faCancel} className="faCancel-icon-on-checklist-card" />
                              </button>
                            </div>
                          ) : (
                            <div className="checklist-name-and-icon-container">
                              <div className="checklist-name">
                                {checklist.name}
                              </div>
                              <div>
                                <button onClick={() => handleEditClick(checklist)}>
                                  <FontAwesomeIcon icon={faEdit} className="faEdit-icon-on-checklist-card" />
                                </button>
                                <button onClick={() => handleDeleteClick(checklist)}>
                                  <FontAwesomeIcon icon={faTrash} className="faTrash-icon-on-checklist-card" />
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="non-flowstep-message-on-document">チェック項目はありません。</div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Document;
