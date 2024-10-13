import React, { useEffect, useState } from 'react';
import FlowStep from './FlowStep'; // FlowStep コンポーネントをインポート

const FlowstepList = ({ onFlowStepUpdated }) => {
    const [flowsteps, setFlowsteps] = useState([]);

    useEffect(() => {
        const fetchFlowsteps = async () => {
            try {
                const response = await fetch('/api/flowsteps');
                const data = await response.json();
                setFlowsteps(data);
                onFlowStepUpdated(); // フローステップが更新されたことを親コンポーネントに通知
            } catch (error) {
                console.error('Error fetching flowsteps:', error);
            }
        };

        fetchFlowsteps();
    }, [onFlowStepUpdated]);

    return (
        <ul>
            {flowsteps.length > 0 ? (
                flowsteps.map((flowstep) => (
                    <li key={flowstep.id}>
                        <FlowStep name={flowstep.name} /> {/* FlowStep コンポーネントを使用 */}
                    </li>
                ))
            ) : (
                <li>No flow steps available.</li> // フローステップがない場合のメッセージ
            )}
        </ul>
    );
};

export default FlowstepList;
