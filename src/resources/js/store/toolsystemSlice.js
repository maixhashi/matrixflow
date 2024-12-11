import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Toolsystemを取得
export const fetchToolsByFlowstep = createAsyncThunk(
    'toolsystems/fetchByFlowstep',
    async (flowstepId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/flowsteps/${flowstepId}/toolsystems`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Toolsystemを追加
export const addToolsystemForFlowstep = createAsyncThunk(
    'toolsystems/addToolsystemForFlowstep',
    async ({ flowstepId, toolsystemName }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/flowsteps/${flowstepId}/toolsystems`, {
                toolsystemName: toolsystemName,
            });
            return response.data; // 必要なデータを返す
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateToolsystemForFlowstep = createAsyncThunk(
    'toolsystems/updateToolsystemForFlowstep',
    async ({ flowstepId, toolsystemId, toolsystemName }, { rejectWithValue }) => {
        console.log('Request Data:', { flowstepId, toolsystemId, toolsystemName });  // リクエストデータを確認

        try {
            const response = await axios.put(`/api/flowsteps/${flowstepId}/toolsystems/${toolsystemId}`, {
                toolsystemName: toolsystemName,
            });

            console.log('Response:', response.data);  // レスポンスを確認
            return { toolsystemId, toolsystemName };
        } catch (error) {
            console.error('Error updating toolsystem:', error.response.data);  // エラー内容を確認
            return rejectWithValue(error.response.data);
        }
    }
);

const toolsystemSlice = createSlice({
    name: 'toolsystems',
    initialState: {
        toolsystems: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchToolsByFlowstep.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchToolsByFlowstep.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log("Fetched toolsystems:", action.payload);
                state.toolsystems = action.payload || []; // 万が一、空配列が返される場合の対策
            })
            .addCase(fetchToolsByFlowstep.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.error("Error fetching toolsystems:", action.payload);
            })
            .addCase(addToolsystemForFlowstep.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (Array.isArray(state.toolsystems)) {
                    state.toolsystems.push(action.payload);
                } else {
                    console.error("toolsystems is not an array");
                }
            })
            .addCase(addToolsystemForFlowstep.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.error("Error adding toolsystem:", action.payload);
            })
            .addCase(updateToolsystemForFlowstep.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { toolsystemId, toolsystemName } = action.payload;
                const index = state.toolsystems.findIndex(
                    (toolsystem) => toolsystem.id === toolsystemId
                );
                if (index !== -1) {
                    state.toolsystems[index].toolsystemName = toolsystemName;
                }
            })
            .addCase(updateToolsystemForFlowstep.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.error("Error updating toolsystem:", action.payload);
            });
    },
});


export default toolsystemSlice.reducer;
