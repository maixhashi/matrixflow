import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import '../../css/MatrixView.css';

const MatrixView = ({ members, flowsteps }) => {
    console.log("Members:", members); // membersの内容を出力
    console.log("Flowsteps:", flowsteps); // flowstepsの内容を出力

    return (
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
                                {flowsteps.map((flowstep) => {
                                    console.log("Flowstep:", flowstep); // ここでflowstepを出力
                                    return (
                                        <td key={flowstep.id} className="matrix-cell">
                                            {flowstep && flowstep.members && flowstep.members.some(m => m.id === member.id) ? (
                                                <FlowStep flowstep={flowstep} />
                                            ) : (
                                                <div></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MatrixView;
