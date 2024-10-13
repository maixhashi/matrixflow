import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './memberSlice';
import flowstepsReducer from './flowstepsSlice';
import flowStepReducer from './flowStepSlice'; // 適切なパスを指定


const store = configureStore({
    reducer: {
        members: memberReducer,
        flowsteps: flowstepsReducer,
        flowStep: flowStepReducer
    },
});

export default store;
