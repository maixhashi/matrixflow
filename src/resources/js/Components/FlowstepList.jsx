import React, { useEffect, useState } from 'react';

const FlowstepList = ({ onFlowStepUpdated }) => {
    const [flowsteps, setFlowsteps] = useState([]);

    useEffect(() => {
        const fetchFlowsteps = async () => {
            const response = await fetch('/api/flowsteps');
            const data = await response.json();
            setFlowsteps(data);
            onFlowStepUpdated(); // フローステップが更新されたことを親コンポーネントに通知
        };

        fetchFlowsteps();
    }, [onFlowStepUpdated]);

    return (
        <ul>
            {flowsteps.map((flowstep) => (
                <li key={flowstep.id}>{flowstep.name}</li>
            ))}
        </ul>
    );
};

export default FlowstepList;
