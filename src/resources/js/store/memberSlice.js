import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Axiosをインポート

export const addMember = createAsyncThunk('members/addMember', async (newMember) => {
    const response = await axios.post('/api/members', newMember); // Axiosを使ってPOSTリクエスト

    if (response.status !== 200) {
        throw new Error('Failed to add member');
    }

    return response.data; // レスポンスデータを返す
});

const memberSlice = createSlice({
    name: 'members',
    initialState: [],
    reducers: {
        setMembers: (state, action) => {
            return action.payload;
        },
    },
});

export const { setMembers } = memberSlice.actions;
export default memberSlice.reducer;
