import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFlowsteps } from '../store/flowstepsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types'; // PropTypesをインポート

import '../../css/AddCheckListForm.css';

const AddCheckListForm = ({
    members,
    member = null,
    stepNumber = '',
    nextStepNumber,
    workflowId,
    checkListsByColumn,
    setCheckListsByColumn,
}) => {
    const [checkItemName, setCheckItemName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState(member ? [member.id] : []);
    const [selectedStepNumber, setSelectedStepNumber] = useState(stepNumber);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (member) {
            setSelectedMembers([member.id]);
        }
        if (stepNumber) {
            setSelectedStepNumber(stepNumber);
        }
    }, [member, stepNumber]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkItemName || selectedMembers.length === 0) {
            return;
        }

        const newCheckItem = {
            id: Date.now(),
            name: checkItemName,
            check_items: selectedMembers.map(memberId => ({
                id: Date.now(),
                check_content: "⚪︎⚪︎する",
                member_id: memberId
            })),
        };

        setCheckListsByColumn((prev) => ({
            ...prev,
            [selectedStepNumber]: prev[selectedStepNumber]
                ? [...prev[selectedStepNumber], newCheckItem]
                : [newCheckItem]
        }));

        setCheckItemName('');
        setSelectedMembers([]);
        console.log('Check item added:', newCheckItem);
        dispatch(fetchFlowsteps(workflowId));
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

    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
          <div>
              <form className="form-container" onSubmit={handleSubmit}>
                  <div className="AddCheckListForm-title">
                    <FontAwesomeIcon icon={faClipboardCheck} className="AddCheckListForm-title-icon" />
                    チェックリストを追加
                    <FontAwesomeIcon icon={faClipboardCheck} className="AddCheckListForm-title-icon" />
                  </div>
                  <div>
                      <label>チェックリスト名:</label>
                      <input
                          type="text"
                          value={checkItemName}
                          onChange={(e) => setCheckItemName(e.target.value)}
                          required
                          placeholder="チェックリストの名前を入力"
                          />
                  </div>
                  <div className="AddCheckListForm-checklist-input">
                    <label>チェックリストの項目:</label>
                    <ul>
                      <li>
                        <input
                            type="text"
                            value={checkItemName}
                            onChange={(e) => setCheckItemName(e.target.value)}
                            required
                            placeholder="チェックリストの項目を入力"
                        />
                      </li>
                    </ul>
                  </div>
                  <button type="submit">チェックリストを追加</button>
              </form>
          </div>
        </>
    );
};

AddCheckListForm.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ),
    member: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    stepNumber: PropTypes.string,
    nextStepNumber: PropTypes.string,
    workflowId: PropTypes.number.isRequired,
    checkListsByColumn: PropTypes.object.isRequired,
    setCheckListsByColumn: PropTypes.func.isRequired,
};

export default AddCheckListForm;
