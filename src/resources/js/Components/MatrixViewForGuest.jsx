import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers } from '../store/memberSliceForGuest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixCol = ({ openModal, flowNumber, member }) => {
    const flowsteps = useSelector((state) => state.flowstepsForGuest);

    useEffect(() => {
        dispatch(fetchFlowsteps()); // コンポーネントがマウントされたときにフローステップを取得
    }, [dispatch]);


    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FLOWSTEP',
        drop: (item) => {
            const droppedFlowStepId = item.id;
            onAssignFlowStep(member.id, droppedFlowStepId); // 現在のメンバーを使用
            updateFlowStepNumber(droppedFlowStepId, flowNumber);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <td className="matrix-cell" ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'white' }}>
            {flowsteps
                .filter(step => step.flow_number === flowNumber && step.members.some(m => m.id === member.id))
                .map(flowstep => (
                    <div key={flowstep.id} className="member-cell">
                        <FlowStep flowstep={flowstep} />
                    </div>
                ))}
            {!flowsteps.some(step => step.flow_number === flowNumber && step.members.some(m => m.id === member.id)) && (
                <div className="member-cell">
                    <button className="add-step-button" onClick={() => openModal(member, flowNumber)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            )}
        </td>
    );
};

const MatrixRow = ({ member, openModal, maxFlowNumber, onMemberDelete }) => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchMembers());
    }, [dispatch]);

    return (
        <tr>
            <td className="matrix-side-header">
                <div className="member-cell">
                    {member.name}
                    <button onClick={() => onMemberDelete(member.id)} className="delete-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </td>
            {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                <MatrixCol key={flowNumber} member={member} openModal={openModal} flowNumber={flowNumber} />
            ))}
            <td className="matrix-cell next-step-column">
                <button className="add-step-button" onClick={() => openModal(member, maxFlowNumber + 1)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    );
};

const MatrixViewForGuest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [maxFlowNumber, setMaxFlowNumber] = useState(0);
    const dispatch = useDispatch();
    
    const members = useSelector((state) => state.membersForGuest); // Get members from the Redux store
    const flowsteps = useSelector((state) => state.flowstepsForGuest) || []; // Default to an empty array

    useEffect(() => {
        dispatch(fetchMembers());
    }, [dispatch]);

    const openModal = (member, stepNumber) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMember(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        // Check if flowsteps is defined and has elements before accessing its properties
        if (flowsteps && flowsteps.length > 0) {
            const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
            setMaxFlowNumber(maxFlowNumber);
        } else {
            setMaxFlowNumber(0);
        }
    }, [flowsteps]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="matrix-container">
                <div className="matrix-title">MatrixFlow</div>
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th className="matrix-corner-header">Members / FlowStep</th>
                            {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                                <th key={flowNumber} className="matrix-header">STEP {flowNumber}</th>
                            ))}
                            <th className="matrix-header next-step-column">STEP {maxFlowNumber + 1}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <MatrixRow key={member.id} member={member} openModal={openModal} maxFlowNumber={maxFlowNumber} />
                        ))}
                        <tr>
                            <td className="matrix-side-header">
                                <AddMemberForm />
                            </td>
                            {Array.from({ length: maxFlowNumber }, (_, i) => (
                                <td key={i} className="matrix-cell"></td>
                            ))}
                            <td className="matrix-cell next-step-column">
                                <button className="add-step-button" onClick={() => openModal(null, maxFlowNumber + 1)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <ModalforAddFlowStepForm isOpen={isModalOpen} onClose={closeModal}>
                    <AddFlowStepForm
                        member={selectedMember}
                        onClose={closeModal}
                        onFlowStepAdded={(newFlowStep) => {
                            dispatch(addFlowstep(newFlowStep));
                        }}
                    />
                </ModalforAddFlowStepForm>
            </div>
        </DndProvider>
    );
};

export default MatrixViewForGuest;
