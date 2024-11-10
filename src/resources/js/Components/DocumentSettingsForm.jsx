import React from 'react';
import '../../css/DocumentSettingsForm.css'

const DocumentSettingsForm = ({ showChecklists, setShowChecklists }) => {
  const handleCheckboxChange = (e) => {
    setShowChecklists(e.target.checked);
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
