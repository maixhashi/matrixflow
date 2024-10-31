import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowsteps } from '../store/flowstepsSlice';
import { fetchCheckLists } from '../store/checklistSlice';
import { fetchWorkflow } from '../store/workflowSlice'; // ワークフローを取得するためのアクション
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import '../../css/Document.css';

const Document = ({ workflowId }) => {
  const dispatch = useDispatch();

  // Redux ストアから必要なデータを取得
  const { workflows, loading, error } = useSelector((state) => state.workflow);
  const flowsteps = useSelector((state) => state.flowsteps);
  const checklists = useSelector((state) => state.checkLists);

  useEffect(() => {
    dispatch(fetchFlowsteps(workflowId));
    dispatch(fetchCheckLists(workflowId));
    dispatch(fetchWorkflow(workflowId));
  }, [dispatch, workflowId]);

  // ローディング中の処理
  if (loading) {
    return <div>ローディング中...</div>;
  }

  // エラーがあれば表示
  if (error) {
    return <div style={{ color: 'red' }}>エラー: {error}</div>;
  }

  // ワークフロー名の表示
  const workflowName = workflows[0]?.name;

  return (
    <div className="document-container">
      <div className="document-title">{workflowName ? workflowName : 'ワークフローが見つかりません。'}</div>

      {flowsteps.length === 0 ? (
        <p>フローステップはまだありません。</p>
      ) : (
        flowsteps.map((flowstep, index) => {
          // 各フローステップに対応するチェックリストを取得
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

              {/* チェック項目を表示 */}
              <div className="checklist-container-card">
                <div className="checklist-title">チェック項目</div>
                {flowstepChecklists.length > 0 ? (
                  <ul className="checklist-container">
                    {flowstepChecklists.map((checklist) => (
                      <li key={checklist.id} className="checklist-card">
                        <FontAwesomeIcon icon={faClipboardCheck} className="icon-on-checklist-card" />
                        {checklist.name}
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
