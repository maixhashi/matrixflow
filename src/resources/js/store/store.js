import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './memberSlice';
import flowstepsReducer from './flowstepsSlice';


const store = configureStore({
    reducer: {
        members: memberReducer,
        flowsteps: flowstepsReducer
    },
});

export default store;
