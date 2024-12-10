import React from 'react';

// FontAwesomeアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

// カスタムフックのインポート
import { useFormforAddMember } from '../../Hooks/useFormforAddMember';

// cssのインポート
import '../../../css/FormforAddMember.css';

const FormforAddMember = () => {
    const { 
        // Local State
        name, setName, error,
        // Event Handler
        handleSubmit,
      } = useFormforAddMember();
    
    
    return (
        <form onSubmit={handleSubmit} className="mb-4">
            {error && <div className="error-message">{error}</div>}
            <div className="form-row">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="担当者の名前を入力"
                        required
                    />
                </div>
                <div>
                    <button type="submit">
                        <FontAwesomeIcon icon={faUserPlus} size="2x" />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormforAddMember;
