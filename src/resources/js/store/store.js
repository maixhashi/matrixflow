import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './memberSlice';
import flowstepsReducer from './flowstepsSlice';
import memberReducerForGuest from './memberSliceForGuest';


const store = configureStore({
    reducer: {
        members: memberReducer,
        flowsteps: flowstepsReducer,
        membersForGuest: memberReducerForGuest
    },
});

export default store;
