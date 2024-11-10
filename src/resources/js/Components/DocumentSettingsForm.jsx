import React from 'react';
import '../../css/DocumentSettingsForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { showChecklistsOnDocument, hideChecklistsOnDocument } from '../store/checklistSlice';

const DocumentSettingsForm = () => {
  const dispatch = useDispatch();
  const showChecklists = useSelector((state) => state.checkLists.showingChecklistsOnDocument);

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      dispatch(showChecklistsOnDocument());
    } else {
      dispatch(hideChecklistsOnDocument());
    }
  };

  return (
    <div className="document-settings-form">
      <div className="document-settings-checklist-visible">
        <div>
          <input 
            type="checkbox" 
            checked={showChecklists} 
            onChange={handleCheckboxChange} 
          />
        </div>
        <div className="document-setting-item">
          チェックリストを表示する
        </div>
      </div>
    </div>
  );
};

export default DocumentSettingsForm;
