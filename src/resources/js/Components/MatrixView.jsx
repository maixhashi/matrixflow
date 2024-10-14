import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';
import AddMemberForm from '../Components/AddMemberForm';

const MatrixView = ({ members, flowsteps, onAssignFlowStep, onMemberAdded }) => {
    // 先にフックを呼び出す
    const dropRefs = flowsteps.map(() => useDrop({
        accept: 'FLOWSTEP',
        drop: (item, monitor, index) => {
            const assignedMembersBeforeDrop = flowsteps[index].members 
                ? flowsteps[index].members.map(m => m.id) 
                : [];
            onAssignFlowStep(members[index].id, item.id, assignedMembersBeforeDrop);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <h2>Matrix View</h2>
                {members.length === 0 || flowsteps.length === 0 ? (
                    <p>No data available.</p>
                ) : (
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="matrix-corner-header">Members / FlowStep</th>
                                {flowsteps.map((flowstep) => (
                                    <th key={flowstep.id} className="matrix-header">STEP {flowstep.flow_number}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, memberIndex) => (
                                <tr key={member.id}>
                                    <td className="matrix-side-header">
                                        <div className="member-cell">
                                            <div>
                                                {member.name}
                                            </div>
                                            <div className="member-icon">
                                                <FontAwesomeIcon icon={faUser} size="2x" />
                                            </div>
                                        </div>
                                    </td>
                                    {flowsteps.map((flowstep, flowstepIndex) => {
                                        const [{ isOver }, drop] = dropRefs[flowstepIndex];

                                        return (
                                            <td 
                                                key={flowstep.id} 
                                                className="matrix-cell" 
                                                ref={drop}
                                                style={{ backgroundColor: isOver ? '#f0f0f0' : 'white' }}
                                            >
                                                {flowstep.members && flowstep.members.some(m => m.id === member.id) ? (
                                                    <FlowStep flowstep={flowstep} />
                                                ) : (
                                                    <div></div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm onMemberAdded={onMemberAdded} />
                                    </div>
                                </td>
                                {flowsteps.map((flowstep) => (
                                    <td key={flowstep.id} className="matrix-cell">
                                        <div></div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </DndProvider>
    );
};

export default MatrixView;
