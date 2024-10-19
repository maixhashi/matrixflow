import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Axiosをインポート

// メンバー追加のための非同期関数
export const addMember = createAsyncThunk('members/addMember', async (newMember) => {
    const response = await axios.post('/api/members', newMember); // Axiosを使ってPOSTリクエスト

    if (response.status !== 200) {
        throw new Error('Failed to add member');
    }

    return response.data; // レスポンスデータを返す
});

// メンバー名更新のための非同期関数
export const updateMemberName = createAsyncThunk('members/updateMemberName', async ({ id, name }) => {
    const response = await axios.put(`/api/members/${id}`, { name }); // Axiosを使ってPUTリクエスト

    if (response.status !== 200) {
        throw new Error('Failed to update member name');
    }

    return response.data; // 更新後のメンバーデータを返す
});

// メンバー削除のための非同期関数
export const deleteMember = createAsyncThunk('members/deleteMember', async (memberId) => {
    const response = await axios.delete(`/api/members/${memberId}`); // Axiosを使ってDELETEリクエスト

    if (response.status !== 200) {
        throw new Error('Failed to delete member');
    }

    return memberId; // 削除したメンバーのIDを返す
});

// メンバー一覧取得のための非同期関数
export const fetchMembers = createAsyncThunk('members/fetchMembers', async () => {
    const response = await axios.get('/api/members'); // Axiosを使ってGETリクエスト

    if (response.status !== 200) {
        throw new Error('Failed to fetch members');
    }

    return response.data; // レスポンスデータを返す
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
            .addCase(deleteMember.fulfilled, (state, action) => {
                return state.filter(member => member.id !== action.payload); // 削除したメンバーをリストから除外
            });
    },
});

// エクスポート
export const { setMembers } = memberSlice.actions;
export default memberSlice.reducer;
