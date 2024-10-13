import React from 'react';
import { useDrag } from 'react-dnd';
import '../../css/Flowstep.css';

const FlowStep = ({ flowstep }) => {
    if (!flowstep) {
        return <div>No Flowstep Data</div>; // データがない場合の処理
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'FLOWSTEP',
        item: { id: flowstep.id, name: flowstep.name },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className="flow-step" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <h4 className="flow-step-name">{flowstep.name}</h4>
        </div>
    );
};

export default FlowStep;
