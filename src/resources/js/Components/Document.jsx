import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFlowsteps } from '../store/flowstepsSlice'; 
import axios from 'axios';
import '../../css/Document.css'

const Document = () => {
  const dispatch = useDispatch();

  const [flowsteps, setFlowsteps] = useState([]);
  

  useEffect(() => {
    dispatch(fetchFlowsteps());
  }, [dispatch]);


  useEffect(() => {
    const fetchFlowstepsWithMembers = async () => {
      try {
        const response = await axios.get('/api/flowsteps'); // すべてのFlowstepを取得するAPI
        const flowstepsWithMembers = await Promise.all(
          response.data.map(async (flowstep) => {
            const res = await axios.get(`/api/flowsteps/${flowstep.id}/members`);
            return res.data;
          })
        );
        setFlowsteps(flowstepsWithMembers);
      } catch (error) {
        console.error('Error fetching flowsteps:', error);
      }
    };

    fetchFlowstepsWithMembers();
  }, []);

  return (
    <div className="document-container">
      <h2>Document</h2>
      {flowsteps.map((flowstep, index) => (
        <div key={flowstep.id} className="chapter">
          <h2 className="chapter">{index + 1}: {flowstep.name}</h2>
          <p>
            {flowstep.members.length > 0
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
