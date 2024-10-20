import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy initial members data
const initialMembers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
];

// Create async thunk for adding a member
export const addMemberForGuest = createAsyncThunk('membersForGuest/addMember', async (newMember) => {
    // Simulating an API call to add the member
    const response = await new Promise((resolve) => {
        const memberWithId = { id: Date.now(), ...newMember }; // Create a new member with a unique id
        resolve(memberWithId);
    });
    return response; // Return the new member
});

// Create async thunk for fetching members
export const fetchMembers = createAsyncThunk('membersForGuest/fetchMembers', async () => {
    // Simulating an API call to fetch members
    return initialMembers; // Return initial members for simulation
});

// Member slice
const memberSliceForGuest = createSlice({
  name: 'membersForGuest',
  initialState: initialMembers,
  reducers: {
    addMemberForGuest: (state, action) => {
        // Add the new member directly to the state
        state.push(action.payload);
    },
    deleteMemberForGuest: (state, action) => {
        // Filter out the member by ID
        return state.filter(member => member.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(addMemberForGuest.fulfilled, (state, action) => {
            console.log("Adding member:", action.payload); // Log the member being added
            state.push(action.payload); // Add new member to the state
        })
        .addCase(fetchMembers.fulfilled, (state, action) => {
            console.log("Fetched members:", action.payload); // Log the fetched members
            return action.payload; // Replace state with fetched members
        });
  }
});

// Export actions
export const { deleteMemberForGuest } = memberSliceForGuest.actions;

// Export the slice reducer
export default memberSliceForGuest.reducer;
