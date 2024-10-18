import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteFlowstepAsync, fetchFlowsteps } from '../store/flowstepsSlice'; // Adjust the import path as needed
import '../../css/AddFlowStepForm.css';

const AddFlowStepForm = ({ members = [], onFlowStepAdded = () => {}, member = null, stepNumber = '', nextStepNumber }) => {
    const [name, setName] = useState(''); 
    const [flowNumber, setFlowNumber] = useState(stepNumber); 
    const [selectedMembers, setSelectedMembers] = useState(member ? [member.id] : []); 
    const [selectedStepNumber, setSelectedStepNumber] = useState(stepNumber); 
    const [searchTerm, setSearchTerm] = useState(''); 

    const dispatch = useDispatch(); // Get the dispatch function
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    useEffect(() => {
        if (member) {
            setSelectedMembers([member.id]);
        }
        if (stepNumber) {
            setFlowNumber(stepNumber);
            setSelectedStepNumber(stepNumber);
        }
    }, [member, stepNumber]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jsonData = {
            name: name,
            flow_number: flowNumber,
            member_id: selectedMembers,
            step_number: selectedStepNumber,
        };

        try {
            const response = await fetch('/api/flowsteps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();

            // Fetch updated flow steps
            dispatch(fetchFlowsteps()); // Fetch the updated list after adding a new flow step

            if (typeof onFlowStepAdded === 'function') {
                onFlowStepAdded();
            }

            setName('');
            setFlowNumber('');
            setSelectedMembers([]);
            setSelectedStepNumber('');
            setSearchTerm('');
        } catch (error) {
            console.error('Error submitting flowstep:', error.message);
        }
    };

    const handleDelete = (id) => {
        dispatch(deleteFlowstepAsync(id));
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
    };

    const handleStepChange = (e) => {
        setSelectedStepNumber(e.target.value);
    };

    const filteredMembers = members.filter((m) => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit}>
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
                    <label>Select Step Number:</label>
                    <select
                        value={selectedStepNumber}
                        onChange={handleStepChange}
                        required
                    >
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Type to search..."
                    />
                </div>
                <div>
                    <label>Select Members:</label>
                    <select
                        multiple
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
            <button onClick={() => handleDelete(flowStepId)}>Delete Flow Step</button>
        </div>
    );
};

export default AddFlowStepForm;
