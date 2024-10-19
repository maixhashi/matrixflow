import { createSlice } from '@reduxjs/toolkit';

// 初期メンバーのダミーデータ
const initialMembers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
];

const memberSliceForGuest = createSlice({
    name: 'membersForGuest',
    initialState: initialMembers, // 初期状態をダミーデータで設定
    reducers: {
        setMembers: (state, action) => {
            return action.payload; // ステートを新しいメンバーリストで更新
        },
        addMember: (state, action) => {
            const newMember = {
                id: state.length + 1, // 新しいIDを生成
                name: action.payload,
            };
            state.push(newMember); // 新しいメンバーを追加
        },
        updateMemberName: (state, action) => {
            const index = state.findIndex(member => member.id === action.payload.id);
            if (index !== -1) {
                state[index].name = action.payload.name; // メンバー名を更新
            }
        },
        deleteMember: (state, action) => {
            return state.filter(member => member.id !== action.payload); // 削除したメンバーをリストから除外
        },
    },
});

// `fetchMembers`関数を追加
export const fetchMembers = () => (dispatch) => {
    // ダミーデータに基づいてメンバーを取得するロジックを追加
    dispatch(setMembers(initialMembers)); // 初期メンバーを設定
};

// エクスポート
export const { setMembers, addMember, updateMemberName, deleteMember } = memberSliceForGuest.actions;
export default memberSliceForGuest.reducer;
