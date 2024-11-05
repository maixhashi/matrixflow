import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import '../../css/Flowstep.css';
import { useDispatch } from 'react-redux';
import { fetchFlowsteps, deleteFlowstepAsync, updateFlowstepAsync } from '../store/flowstepsSlice'; // Import the async actions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';

const FlowStep = ({ flowstep, workflowId }) => {
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
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(flowstep.name); // Initial value from flowstep.name
    const [isHovered, setIsHovered] = useState(false); // Hover state
    const dispatch = useDispatch();

    const handleDelete = async () => {
        setIsDeleting(true); // Set deleting state
        await dispatch(deleteFlowstepAsync(flowstep.id)); // Dispatch delete action
        setIsDeleting(false); // Reset deleting state
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setNewName(flowstep.name); // Reset the name to the original value
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewName(flowstep.name); // Reset the name to the original value
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateFlowstepAsync({ id: flowstep.id, updatedFlowstep: { name: newName } }));
        setIsEditing(false); // Close the form after submitting
        dispatch(fetchFlowsteps(workflowId));
    };

    return (
        <div 
            ref={drag} 
            className="flow-step" 
            style={{ opacity: isDragging ? 0.5 : 1 }} 
            onMouseEnter={() => setIsHovered(true)} // Set hover state
            onMouseLeave={() => setIsHovered(false)} // Reset hover state
        >
            {isEditing ? (
                <form onSubmit={handleSubmit} className="edit-flowstep-form">
                    <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        required 
                    />
                    <button type="submit"><FontAwesomeIcon icon={faSave} /></button>
                    <button type="button" onClick={handleCancel}><FontAwesomeIcon icon={faCancel} /></button>
                </form>
            ) : (
                <>
                    <div className="flowstep-name-container">
                        <div className="flowstep-name">{flowstep.name}</div>
                        {isHovered && ( // Show edit button only on hover
                            <button onClick={handleEditClick} className="flowstep-name-edit-button">
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                        )}
                    </div>
                    <button onClick={handleDelete} className="delete-button" disabled={isDeleting}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </>
            )}
        </div>
    );
};

export default FlowStep;
