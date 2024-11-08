import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCheckListModalOpen: false,
  isOpenModalforAddFlowStepForm: false,
  selectedCheckList: null,
  selectedMember: null,
  selectedStepNumber: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openCheckListModal: (state, action) => {
      state.isCheckListModalOpen = true;
      state.selectedCheckList = action.payload.checkList;
    },
    closeCheckListModal: (state) => {
      state.isCheckListModalOpen = false;
      state.selectedCheckList = null;
    },
    openAddFlowStepModal: (state, action) => {
      state.isAddFlowStepModalOpen = true;
      state.selectedMember = action.payload.member;
      state.selectedStepNumber = action.payload.stepNumber;
    },
    closeAddFlowStepModal: (state) => {
      state.isAddFlowStepModalOpen = false;
      state.selectedMember = null;
      state.selectedStepNumber = null;
    },
    openModalforAddFlowStepForm: (state) => { // 追加
      state.isOpenModalforAddFlowStepForm = true;
    },
    closeModalforAddFlowStepForm: (state) => { // 追加
      state.isOpenModalforAddFlowStepForm = false;
    },
  },
});

export const {
  openCheckListModal,
  closeCheckListModal,
  openAddFlowStepModal,
  closeAddFlowStepModal,
  openModalforAddFlowStepForm, // 追加
  closeModalforAddFlowStepForm, // 追加
} = modalSlice.actions;

export default modalSlice.reducer;
