import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '../../css/FormforAddMember.css';
import { fetchMembers, addMemberForGuest } from '../store/memberSliceForGuest';

const AddMemberFormForGuest = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
        await dispatch(addMemberForGuest({ name: name })); // Wait for the action to complete
        setName(''); // Clear input field
    }
  };

  return (
      <form onSubmit={handleSubmit} className="mb-4">
          <div className="form-row">
              <div>
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Member Name"
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

export default AddMemberFormForGuest;
