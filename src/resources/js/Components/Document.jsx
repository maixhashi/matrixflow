import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowsteps } from '../store/flowstepsSlice';
import { fetchCheckLists } from '../store/checklistSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import '../../css/Document.css';

const Document = ({ workflowId }) => {
  const dispatch = useDispatch();

  // Redux ストアから flowsteps と checklists を取得
  const flowsteps = useSelector((state) => state.flowsteps);
  const checklists = useSelector((state) => state.checkLists);

  useEffect(() => {
    dispatch(fetchFlowsteps(workflowId));
    dispatch(fetchCheckLists(workflowId));
  }, [dispatch, workflowId]);

  if (!Array.isArray(flowsteps)) {
    return <div>Error: flowsteps is not an array.</div>;
  }

  return (
    <div className="document-container">
      <h2>文書</h2>
      {flowsteps.length === 0 ? (
        <p>フローステップはまだありません。</p>
      ) : (
        flowsteps.map((flowstep, index) => {
          // 各フローステップに対応するチェックリストを取得
          const flowstepChecklists = checklists[flowstep.flow_number] || [];
          console.log("flowstepChecklists:", flowstepChecklists);

          return (
            <div key={flowstep.id} className="chapter">
              <h2 className="chapter">{index + 1}: {flowstep.name}</h2>
              <p>
                {flowstep.members && flowstep.members.length > 0
                  ? `${flowstep.members.map(member => member.name).join(', ')} は${flowstep.name}を行う。`
                  : 'Unknown Member が行うタスク:'}
                {flowstep.content}
              </p>

              {/* チェック項目を表示 */}
              <div className="checklist-container-card">
                <div className="checklist-title">チェック項目</div>
                {flowstepChecklists.length > 0 ? (
                  <ul className="checklist-container">
                    {flowstepChecklists.map((checklist) => (
                      <li key={checklist.id} className="checklist-card"><FontAwesomeIcon icon={faClipboardCheck} className="icon-on-checklist-card" />{checklist.name}</li>
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
