import React from 'react';
import '../../css/MatrixView.css'; // CSSファイルをインポート

const MatrixView = ({ members, flowsteps }) => {
    return (
        <table className="matrix-table">
            <thead>
                <tr>
                    <th className="matrix-header">Members</th>
                    {flowsteps.map((flowstep) => (
                        <th key={flowstep.flow_number} className="matrix-header">
                            {flowstep.flow_number}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {members.map((member) => (
                    <tr key={member.id}>
                        <td className="matrix-cell member-cell">{member.name}</td>
                        {flowsteps.map((flowstep) => (
                            <td key={flowstep.flow_number} className="matrix-cell">
                                {/* flow-step要素を表示 */}
                                <div className="flow-step">
                                    {/* 必要な情報をここに格納 */}
                                    <p>{flowstep.name}</p> {/* フローステップの名前 */}
                                    {/* その他のフローステップに関連する要素 */}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MatrixView;
