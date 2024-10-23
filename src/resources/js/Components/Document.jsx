import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowsteps } from '../store/flowstepsSlice'; 
import '../../css/Document.css'

const Document = () => {
  const dispatch = useDispatch();
  
  // Get flowsteps from Redux store
  const flowsteps = useSelector((state) => state.flowsteps);

  useEffect(() => {
    // Fetch flowsteps on component mount
    dispatch(fetchFlowsteps());
  }, [dispatch]);

  return (
    <div className="document-container">
      <h2>文書</h2>
      {flowsteps.map((flowstep, index) => (
        <div key={flowstep.id} className="chapter">
          <h2 className="chapter">{index + 1}: {flowstep.name}</h2>
          <p>
            {flowstep.members && flowstep.members.length > 0
              ? `${flowstep.members.map(member => member.name).join(', ')} は${flowstep.name}を行う。`
              : 'Unknown Member が行うタスク:'}
            {flowstep.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Document;
