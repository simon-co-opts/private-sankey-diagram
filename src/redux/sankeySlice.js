import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sessionsList from '../data/sessionsList.json';

// Thunk to load session data
export const loadSessionData = createAsyncThunk('sankey/loadSessionData', async () => {
  const dataPromises = sessionsList.map(file =>
    fetch(`testData/${file}`).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
  );

  const dataArrays = await Promise.all(dataPromises);

  return dataArrays.map((data, index) => ({
    sessionName: sessionsList[index],
    wordFrequencies: data["word frequencies"] || [],
  }));
});

const sankeySlice = createSlice({
  name: 'sankey',
  initialState: {
    data: [],
    topWords: 5, // Default top N words
    status: 'idle',
  },
  reducers: {
    setTopWords: (state, action) => {
      state.topWords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSessionData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadSessionData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loadSessionData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setTopWords } = sankeySlice.actions;

export const selectSankeyData = (state) => state.sankey.data;
export const selectTopWords = (state) => state.sankey.topWords;
export const selectStatus = (state) => state.sankey.status;

export default sankeySlice.reducer;
