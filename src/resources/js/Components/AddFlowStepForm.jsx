import React, { useState } from 'react';

const AddFlowStepForm = ({ members, onFlowStepAdded }) => {
    const [name, setName] = useState('');
    const [flowNumber, setFlowNumber] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); // CSRFトークンを取得

    const handleSubmit = async (e) => {
        e.preventDefault();

        // フォームの状態をデバッグ出力
        console.log('Submitting Flow Step:');
        console.log('Name:', name);
        console.log('Flow Number:', flowNumber);
        console.log('Selected Members:', selectedMembers);

        // 送信するJSONデータをデバッグ出力
        const jsonData = {
            name: name,
            flow_number: flowNumber,
            member_id: selectedMembers, // 複数のメンバーIDを送信
        };
        console.log('JSON Data to be sent:', JSON.stringify(jsonData, null, 2)); // JSONをきれいに表示

        try {
            const response = await fetch('/api/flowsteps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(jsonData), // JSONデータを送信
            });

            // レスポンスのステータスをデバッグ出力
            console.log('Response Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text(); // テキストとしてエラーレスポンスを取得
                throw new Error(`Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log('Response Data:', data); // レスポンスデータをデバッグ出力
            onFlowStepAdded();
            setName('');
            setFlowNumber('');
            setSelectedMembers([]);
        } catch (error) {
            console.error('Error submitting flowstep:', error.message);
        }
    };

    const handleMemberChange = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedMembers(value);
        console.log('Selected Members Updated:', value); // 選択されたメンバーをデバッグ出力
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Flow Step Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Flow Step Number:</label>
                <input
                    type="number"
                    value={flowNumber}
                    onChange={(e) => setFlowNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Select Members:</label>
                <select
                    multiple // 複数選択を可能にする
                    value={selectedMembers}
                    onChange={handleMemberChange}
                    required
                >
                    {members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Add Flow Step</button>
        </form>
    );
};

export default AddFlowStepForm;
