import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './memberSlice';
import flowstepsReducer from './flowstepsSlice';
import checklistsReducer from './checklistSlice';
import workflowReducer from './workflowSlice';
import modalReducer from './modalSlice';
import selectedReducer from './selectedSlice';
import documentSettingsReducer from './documentSettingsSlice';
import positionsReducer from './positionSlice';
import memberReducerForGuest from './memberSliceForGuest';


const store = configureStore({
    reducer: {
        members: memberReducer,
        flowsteps: flowstepsReducer,
        checkLists: checklistsReducer,
        workflow: workflowReducer,
        modal: modalReducer,
        selected: selectedReducer,
        positions: positionsReducer,
        documentSettings: documentSettingsReducer,
        membersForGuest: memberReducerForGuest
    },
});

export default store;
