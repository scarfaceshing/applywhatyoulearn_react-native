import {createSlice} from '@reduxjs/toolkit';

export const scatterer = createSlice({
  name: 'history',
  initialState: {
    value: [],
  },
  reducers: {
    loadHistory: (state: any, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {loadHistory} = scatterer.actions;

export default scatterer.reducer;
