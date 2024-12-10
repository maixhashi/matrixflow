import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMember } from '../store/memberSlice';

export const useFormforAddMember = () => {
  const dispatch = useDispatch();

  // Local State
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Global State
  const workflowId = useSelector((state) => state.workflow.workflowId);

  // Event Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const memberData = { name }; // 送信するデータを準備

    try {
      // Reduxアクションをディスパッチ
      await dispatch(addMember({ workflowId, newMember: memberData })).unwrap();
      setName(''); // 入力をクリア
      setSuccessMessage('メンバーが正常に追加されました'); // 成功メッセージを設定
    } catch (error) {
      setError('メンバーの追加に失敗しました');
    }
  };

  return {
    // Local State
    name, setName, error, setError, successMessage, setSuccessMessage,
    // Global State
    workflowId,
    // Event Handler
    handleSubmit,
  };
};
