import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowsteps } from '../store/flowstepsSlice';
import { fetchCheckLists, updateChecklist, deleteChecklist } from '../store/checklistSlice';
import { fetchWorkflow } from '../store/workflowSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faEdit, faSave, faCancel, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../css/Document.css';

const Document = ({ workflowId }) => {
  const dispatch = useDispatch();
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [updatedChecklistName, setUpdatedChecklistName] = useState('');

  const { workflows, loading, error } = useSelector((state) => state.workflow);
  const flowsteps = useSelector((state) => state.flowsteps);
  const checklists = useSelector((state) => state.checkLists);

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

  // 新規：削除ボタン用の関数
  const handleDeleteClick = (checklist) => {
    dispatch(deleteChecklist({
      // workflowId,
      checklistId: checklist.id,
    }));
  };

  const workflowName = workflows[0]?.name;

  return (
    <div className="document-container">
      <div className="document-title">{workflowName ? workflowName : 'ワークフローが見つかりません。'}</div>

      {flowsteps.length === 0 ? (
        <p>フローステップはまだありません。</p>
      ) : (
        flowsteps.map((flowstep, index) => {
          const flowstepChecklists = checklists[flowstep.flow_number] || [];

          return (
            <div key={flowstep.id}>
              <div className="chapter">{index + 1}: {flowstep.name}</div>
              <div className="content">
                {flowstep.members && flowstep.members.length > 0
                  ? `${flowstep.members.map(member => member.name).join(', ')} は${flowstep.name}を行う。`
                  : 'Unknown Member が行うタスク:'}
                {flowstep.content}
              </div>

              <div className="checklist-container-card">
                <div className="checklist-title">チェック項目</div>
                {flowstepChecklists.length > 0 ? (
                  <ul className="checklist-container">
                  {flowstepChecklists.map((checklist) => (
                    <li key={checklist.id} className="checklist-card">
                      <FontAwesomeIcon icon={faClipboardCheck} className="icon-on-checklist-card" />
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
                    </li>
                  ))}
                  </ul>
                ) : (
                  <div className="non-flowstep-message-on-document">チェック項目はありません。</div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Document;
