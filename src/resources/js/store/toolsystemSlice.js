import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Toolsystemを取得
export const fetchToolsByFlowstep = createAsyncThunk(
    'toolsystems/fetchByFlowstep',
    async (flowstepId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/flowsteps/${flowstepId}/toolsystems`);
            return response.data.toolsystems;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Toolsystemを更新
export const updateToolsForFlowstep = createAsyncThunk(
  'toolsystems/updateToolsForFlowstep',
  async ({ flowstepId, toolsystemName }, { rejectWithValue }) => {
      try {
          const response = await axios.post(`/api/flowsteps/${flowstepId}/toolsystems`, {
              toolsystemName,
          });
          return response.data;
      } catch (error) {
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
                state.toolsystems = action.payload;
            })
            .addCase(fetchToolsByFlowstep.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateToolsForFlowstep.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateToolsForFlowstep.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.toolsystems = action.payload;
            })
            .addCase(updateToolsForFlowstep.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default toolsystemSlice.reducer;
