import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixView = ({ members, flowsteps, onAssignFlowStep, onMemberAdded }) => {
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
                            {members.map((member) => (
                                <MemberRow 
                                    key={member.id} 
                                    member={member} 
                                    flowsteps={flowsteps} 
                                    onAssignFlowStep={onAssignFlowStep} 
                                />
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

const MemberRow = ({ member, flowsteps, onAssignFlowStep }) => {
    return (
        <tr>
            <td className="matrix-side-header">
                <div className="member-cell">
                    <div>{member.name}</div>
                    <div className="member-icon">
                        <FontAwesomeIcon icon={faUser} size="2x" />
                    </div>
                </div>
            </td>
            {flowsteps.map((flowstep) => {
                const assignedMembersBeforeDrop = flowstep.members ? flowstep.members.map(m => m.id) : [];

                const [{ isOver }, drop] = useDrop({
                    accept: 'FLOWSTEP',
                    drop: (item) => {
                        onAssignFlowStep(member.id, item.id, assignedMembersBeforeDrop);
                    },
                    collect: (monitor) => ({
                        isOver: monitor.isOver(),
                    }),
                });

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
    );
};

export default MatrixView;
