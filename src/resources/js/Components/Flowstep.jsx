import React from 'react';
import { useDrag } from 'react-dnd';
import '../../css/Flowstep.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faCancel, faPencil } from '@fortawesome/free-solid-svg-icons';
import { useFlowstep } from '../Hooks/useFlowstep';

const FlowStep = ({ flowstep }) => {
    const { 
        // Local State
        isDeleting, isEditing, newName, setNewName, isHovered, setIsHovered,
        // Global State
          // none 
        // Event Handler
        handleDelete, handleEditClick, handleCancel, handleSubmit, handleOpenUpdateFlowstepModal
    } = useFlowstep(flowstep);

      
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'FLOWSTEP',
        item: { id: flowstep.id, name: flowstep.name },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));
    
    return (
        <div 
            ref={drag} 
            className="Flowstep"
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
                    <div className="button-container-for-flowstep">
                        <div onClick={handleOpenUpdateFlowstepModal} className="faPencil-button-for-flowstep">
                            <FontAwesomeIcon icon={faPencil} />
                        </div>
                        <div onClick={handleDelete} className="delete-button" disabled={isDeleting}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FlowStep;
