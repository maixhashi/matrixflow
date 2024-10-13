import React from 'react';
import '../../css/Flowstep.css';

const FlowStep = ({ name }) => {
    return (
        <div className="flow-step">
            <h4 className="flow-step-name">{ name }</h4>
        </div>
    );
};

export default FlowStep;
