import { createSlice } from '@reduxjs/toolkit';

export const flowstepsSlice = createSlice({
  name: 'flowsteps',
  initialState: [],
  reducers: {
    setFlowsteps: (state, action) => {
      return action.payload;
    },
  },
});

export const addFlowstep = (newFlowstep) => async (dispatch) => {
  const response = await fetch('/api/flowsteps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    body: JSON.stringify(newFlowstep),
  });
  const data = await response.json();
  dispatch(setFlowsteps([...flowsteps, data]));
};

export const { setFlowsteps } = flowstepsSlice.actions;
export default flowstepsSlice.reducer;
