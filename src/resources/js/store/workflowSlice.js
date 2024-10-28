import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createWorkflow = createAsyncThunk(
    'workflow/create',
    async (workflowName, { rejectWithValue }) => {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        try {
            const response = await axios.post('/api/workflows', {
                name: workflowName
            }, {
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                maxRedirects: 0,
            });
            return response.data; // 返り値として新しいワークフローを返す
        } catch (error) {
            // エラー処理
            if (error.response && error.response.status === 302) {
                window.location.href = error.response.headers.location;
            }
            return rejectWithValue('Failed to create workflow');
        }
    }
);

const workflowSlice = createSlice({
    name: 'workflow',
    initialState: {
        workflows: [],
        workflowId: null, // workflowIdを追加
        isSubmitting: false,
        flashMessage: '',
        error: null,
    },
    reducers: {
        clearFlashMessage: (state) => {
            state.flashMessage = '';
        },
        setWorkflowId: (state, action) => {
            state.workflowId = action.payload; // workflowIdを設定するアクション
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWorkflow.pending, (state) => {
                state.isSubmitting = true;
            })
            .addCase(createWorkflow.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.workflows.push(action.payload); // 新しいワークフローを追加
                state.workflowId = action.payload.id; // 新しいワークフローのIDを保存
                state.flashMessage = `ワークフローを作成しました: ${action.payload.name}`;
                setTimeout(() => {
                    state.flashMessage = '';
                }, 5000);
            })
            .addCase(createWorkflow.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload; // エラーメッセージを保存
                state.flashMessage = action.payload; // エラーメッセージをフラッシュメッセージとして設定
                setTimeout(() => {
                    state.flashMessage = '';
                }, 5000);
            });
    },
});

export const { clearFlashMessage, setWorkflowId } = workflowSlice.actions;
export default workflowSlice.reducer;
