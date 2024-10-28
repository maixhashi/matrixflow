import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './memberSlice';
import flowstepsReducer from './flowstepsSlice';
import checklistsReducer from './checklistSlice';
import workflowReducer from './workflowSlice';
import memberReducerForGuest from './memberSliceForGuest';
import workflowSlice from './workflowSlice';


const store = configureStore({
    reducer: {
        members: memberReducer,
        flowsteps: flowstepsReducer,
        checkLists: checklistsReducer,
        workflow: workflowReducer,
        membersForGuest: memberReducerForGuest
    },
});

export default store;
