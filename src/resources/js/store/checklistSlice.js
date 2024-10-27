import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCheckLists = createAsyncThunk(
    'checklists/fetchCheckLists',
    async (workflowId) => {
        const response = await axios.get(`/api/workflows/${workflowId}/checklists`);
        return response.data;
    }
);

export const addCheckList = createAsyncThunk(
    'checklists/addCheckList',
    async ({ workflowId, checklist }) => {
        const response = await axios.post(`/api/workflows/${workflowId}/checklists`, checklist);
        return response.data;
    }
);

const checklistSlice = createSlice({
    name: 'checklists',
    initialState: {
        checkLists: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCheckLists.fulfilled, (state, action) => {
                state.checkLists = action.payload;
            })
            .addCase(addCheckList.fulfilled, (state, action) => {
                state.checkLists.push(action.payload);
            });
    },
});

export default checklistSlice.reducer;
