import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import '../../css/Flowstep.css';
import { useDispatch } from 'react-redux';
import { deleteFlowstepAsync } from '../store/flowstepsSlice'; // Import the async action
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FlowStep = ({ flowstep }) => {
    if (!flowstep) {
        return <div>フローステップのデータがありません</div>;
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'FLOWSTEP',
        item: { id: flowstep.id, name: flowstep.name },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [isDeleting, setIsDeleting] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        setIsDeleting(true); // 削除開始時に状態を変更
        await dispatch(deleteFlowstepAsync(flowstep.id)); // Dispatch the correct async action
        setIsDeleting(false); // 削除完了時に状態を戻す
    };

    return (
        <div ref={drag} className="flow-step" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <h4 className="flow-step-name">{flowstep.name}</h4>
            <button onClick={handleDelete} className="delete-button" disabled={isDeleting}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
};

export default FlowStep;
