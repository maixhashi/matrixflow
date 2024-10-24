import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Axiosをインポート

// Memberを取得するアクション
export const fetchMembers = createAsyncThunk(
    'members/fetchMembers',
    async (workflowId, { dispatch, rejectWithValue }) => {
      try {
        const response = await axios.get(`/api/workflows/${workflowId}/members`);
        
        if (response.status !== 200) {
          throw new Error('Failed to fetch members');
        }
  
        const data = response.data;
  
        dispatch(setMembers(data)); // Assuming setMembers is your action for setting members
  
        return data; // Return the data if needed
      } catch (error) {
        return rejectWithValue(error.message); // Handle error
      }
    }
);


// メンバー追加のための非同期関数
export const addMember = createAsyncThunk(
    'members/addMember',
    async ({ workflowId, newMember }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/workflows/${workflowId}/members`, newMember);
            return response.data; // レスポンスデータを返す
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// メンバー名更新のための非同期関数
export const updateMemberName = createAsyncThunk('members/updateMemberName', async ({ id, name }) => {
    const response = await axios.put(`/api/members/${id}`, { name }); // Axiosを使ってPUTリクエスト

    if (response.status !== 200) {
        throw new Error('Failed to update member name');
    }

    return response.data; // 更新後のメンバーデータを返す
});

// メンバー削除のための非同期関数
export const deleteMember = createAsyncThunk('members/deleteMember', async (memberId, { rejectWithValue }) => {
    try {
        const response = await fetch(`/api/members/${memberId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete member');
        }
        return memberId; // Return the deleted memberId for the reducer
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
  
const memberSlice = createSlice({
    name: 'members',
    initialState: [],
    reducers: {
        setMembers: (state, action) => {
            return action.payload; // ステートを新しいメンバーリストで更新
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMembers.fulfilled, (state, action) => {
                return action.payload; // ステートを新しいメンバーリストで更新
            })
            .addCase(addMember.fulfilled, (state, action) => {
                state.push(action.payload); // 新しいメンバーを追加
            })
            .addCase(updateMemberName.fulfilled, (state, action) => {
                const index = state.findIndex(member => member.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload; // メンバー名を更新
                }
            })
    },
});

// エクスポート
export const { setMembers } = memberSlice.actions;
export default memberSlice.reducer;
