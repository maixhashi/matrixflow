import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon
import FlowStep from '../Components/Flowstep';
import '../../css/MatrixView.css'; // Assuming you have this CSS import

const MatrixView = ({ members, flowsteps }) => {
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
                                        <div  className="member-icon">
                                            <FontAwesomeIcon icon={faUser} size="2x" /> {/* Correctly using the icon */}
                                        </div>
                                    </div>
                                </td>
                                {flowsteps.map((flowstep) => (
                                    <td key={flowstep.id} className="matrix-cell">
                                        {flowstep.members && flowstep.members.some(m => m.id === member.id) ? (
                                            flowstep && flowstep.name ? (
                                                <FlowStep name={flowstep.name} />
                                            ) : (
                                                <div></div>
                                            )
                                        ) : (
                                            <div></div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MatrixView;
