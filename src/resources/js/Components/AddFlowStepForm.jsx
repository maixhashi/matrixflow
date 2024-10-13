import React, { useState } from 'react';
import axios from 'axios';

const AddFlowStepForm = ({ onFlowStepAdded }) => {
    const [flowStepName, setFlowStepName] = useState('');
    const [flowNumber, setFlowNumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); // CSRFトークンの取得

        try {
            const response = await axios.post('/api/flowsteps', {
                name: flowStepName,
                flow_number: flowNumber // flow_numberを送信
            }, {
                headers: {
                    'X-CSRF-TOKEN': token // CSRFトークンをヘッダーに追加
                }
            });
            
            if (onFlowStepAdded) {
              setFlowStepName('');
              setFlowNumber('');
              onFlowStepAdded(); // フローステップが追加されたことを親コンポーネントに通知
            }
        } catch (error) {
            console.error('Failed to add flowstep', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                value={flowStepName}
                onChange={(e) => setFlowStepName(e.target.value)}
                placeholder="New Flow Step Name"
                required
            />
            <input
                type="text"
                value={flowNumber}
                onChange={(e) => setFlowNumber(e.target.value)}
                placeholder="Flow Number"
                required
            />
            <button type="submit">Add Flow Step</button>
        </form>
    );
};

export default AddFlowStepForm;
