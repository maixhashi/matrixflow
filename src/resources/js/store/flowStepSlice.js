import { createSlice } from '@reduxjs/toolkit';

const flowStepSlice = createSlice({
    name: 'flowStep',
    initialState: {
        members: [],
        flowsteps: [],
    },
    reducers: {
        setMembers(state, action) {
            console.log("setMembers called with:", action.payload); // ログ
            state.members = action.payload;
        },
        setFlowSteps(state, action) {
            console.log("setFlowSteps called with:", action.payload); // ログ
            state.flowsteps = action.payload;
        },
        assignFlowStep(state, action) {
            // 実装
        },
    },
});

export const { setMembers, setFlowSteps, assignFlowStep } = flowStepSlice.actions;
export default flowStepSlice.reducer;
