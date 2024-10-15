import React, { useState, useEffect } from 'react';
import '../../css/AddFlowStepForm.css'; // スタイルをインポート

const AddFlowStepForm = ({ members = [], onFlowStepAdded = () => {}, member = null, stepNumber = '', nextStepNumber }) => {
    const [name, setName] = useState(''); // フロー名をユーザーが自由に入力
    const [flowNumber, setFlowNumber] = useState(stepNumber); // 初期値として渡された stepNumber
    const [selectedMembers, setSelectedMembers] = useState(member ? [member.id] : []); // 初期メンバーとして選択されたメンバー
    const [selectedStepNumber, setSelectedStepNumber] = useState(stepNumber); // 初期ステップ番号
    const [searchTerm, setSearchTerm] = useState(''); // 検索用のステート

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); // CSRFトークンを取得

    useEffect(() => {
        if (member) {
            setSelectedMembers([member.id]); // メンバーIDを初期選択状態に設定
        }
        if (stepNumber) {
            setFlowNumber(stepNumber); // 渡されたSTEP番号を初期値として設定
            setSelectedStepNumber(stepNumber); // 渡されたSTEP番号を選択状態に設定
        }
    }, [member, stepNumber]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // フロー名、フロー番号、選択されたメンバー、選択されたステップ番号をログに出力
        console.log('Submitting Flow Step:');
        console.log('Name:', name);
        console.log('Flow Number:', flowNumber);
        console.log('Selected Members:', selectedMembers);
        console.log('Selected Step Number:', selectedStepNumber);
    
        // jsonDataをここで定義
        const jsonData = {
            name: name,
            flow_number: flowNumber,
            member_id: selectedMembers, // 複数のメンバーIDを送信
            step_number: selectedStepNumber, // 選択されたSTEP番号を送信
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
    
            console.log('Response Status:', response.status);
    
            if (!response.ok) {
                const errorText = await response.text(); // テキストとしてエラーレスポンスを取得
                throw new Error(`Error: ${response.status} ${errorText}`);
            }
    
            const data = await response.json();
            console.log('Response Data:', data); // レスポンスデータをデバッグ出力
    
            // onFlowStepAddedが関数かどうかを確認
            if (typeof onFlowStepAdded === 'function') {
                onFlowStepAdded(); // 親コンポーネントに通知
            } else {
                console.error('onFlowStepAdded is not a function', onFlowStepAdded);
            }
    
            // フォームをリセット
            setName('');
            setFlowNumber('');
            setSelectedMembers([]);
            setSelectedStepNumber(''); // 初期化
            setSearchTerm(''); // 検索ワードをリセット
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

    const handleStepChange = (e) => {
        setSelectedStepNumber(e.target.value); // 選択されたステップ番号を更新
        console.log('Selected Step Number Updated:', e.target.value); // 選択されたSTEP番号をデバッグ出力
    };

    // メンバーを検索するためのフィルター関数
    const filteredMembers = members.filter((m) => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div>
                <label>Flow Step Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // フロー名を自由に入力
                    required
                />
            </div>
            <div>
                <label>Select Step Number:</label>
                <select
                    value={selectedStepNumber}
                    onChange={handleStepChange}
                    required
                >
                    {/* 1 から nextStepNumber までのオプションを生成 */}
                    {Array.from({ length: nextStepNumber }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            STEP {index + 1}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Search Members:</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // 検索ワードを更新
                    placeholder="Type to search..."
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
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No members available</option>
                    )}
                </select>
            </div>
            <button type="submit">Add Flow Step</button>
        </form>
    );
};

export default AddFlowStepForm;
