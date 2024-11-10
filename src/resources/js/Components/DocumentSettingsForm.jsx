import React from 'react';
import '../../css/DocumentSettingsForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
    showChecklistsOnDocument, 
    hideChecklistsOnDocument,
    showFlowstepDescriptionsOnDocument,
    hideFlowstepDescriptionsOnDocument,
    onPDFViewerMode,
    offPDFViewerMode
 } from '../store/documentSettingsSlice';

const DocumentSettingsForm = () => {
  const dispatch = useDispatch();
  const showChecklists = useSelector((state) => state.documentSettings.showingChecklistsOnDocument);
  const showFlowstepDescriptions = useSelector((state) => state.documentSettings.showingFlowstepDescriptionsOnDocument);
  const showPDFViewerMode = useSelector((state) => state.documentSettings.PDFViewerMode);

  const handleShowChecklistsChange = (e) => {
    if (e.target.checked) {
      dispatch(showChecklistsOnDocument());
    } else {
      dispatch(hideChecklistsOnDocument());
    }
  };

  const handleShowFlowstepDescriptionsChange = (e) => {
    if (e.target.checked) {
      dispatch(showFlowstepDescriptionsOnDocument());
    } else {
      dispatch(hideFlowstepDescriptionsOnDocument());
    }
  };

  const handleShowPDFViewerModeChange = (e) => {
    if (e.target.checked) {
      dispatch(onPDFViewerMode());
    } else {
      dispatch(offPDFViewerMode());
    }
  };

  return (
    <div className="document-settings-form">
      <div className="document-settings-checklist-visible">
        <div>
          <input 
            type="checkbox" 
            checked={showChecklists} 
            onChange={handleShowChecklistsChange} 
          />
        </div>
        <div className="document-setting-item">
          チェックリストを表示する
        </div>
      </div>
      <div className="document-settings-checklist-visible">
        <div>
          <input 
            type="checkbox" 
            checked={showFlowstepDescriptions} 
            onChange={handleShowFlowstepDescriptionsChange} 
          />
        </div>
        <div className="document-setting-item">
          フローステップの詳細を表示する
        </div>
      </div>
      <div className="document-settings-checklist-visible">
        <div>
          <input 
            type="checkbox" 
            checked={showPDFViewerMode} 
            onChange={handleShowPDFViewerModeChange} 
          />
        </div>
        <div className="document-setting-item">
          PDFを表示する
        </div>
      </div>
    </div>
  );
};

export default DocumentSettingsForm;
