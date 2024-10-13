import React, { useEffect, useState } from 'react';
import FlowStep from './FlowStep'; // FlowStep コンポーネントをインポート

const FlowstepList = ({ onFlowStepUpdated }) => {
    const [flowsteps, setFlowsteps] = useState([]);
    const [newFlowStepName, setNewFlowStepName] = useState('');

    const handleAddFlowStep = async () => {
        const response = await fetch('/api/flowsteps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newFlowStepName }),
        });
        const data = await response.json();
        setFlowsteps([...flowsteps, data]);
        onFlowStepUpdated(); // フローステップが更新されたことを親コンポーネントに通知
        setNewFlowStepName(''); // フォームをクリア
    };

    useEffect(() => {
        const fetchFlowsteps = async () => {
            const response = await fetch('/api/flowsteps');
            const data = await response.json();
            setFlowsteps(data);
        };
        fetchFlowsteps();
    }, []);

    return (
        <div>
            <input
                type="text"
                value={newFlowStepName}
                onChange={(e) => setNewFlowStepName(e.target.value)}
                placeholder="New FlowStep"
            />
            <button onClick={handleAddFlowStep}>Add FlowStep</button>
            <ul>
                {flowsteps.map((flowstep) => (
                    <li key={flowstep.id}>
                        <FlowStep name={flowstep.name} flowstep={flowstep} /> {/* FlowStep コンポーネントを使用 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlowstepList;
