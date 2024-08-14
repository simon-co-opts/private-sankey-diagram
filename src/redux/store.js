import { configureStore } from '@reduxjs/toolkit';
import sankeyReducer from './sankeySlice';

export const store = configureStore({
  reducer: {
    sankey: sankeyReducer,
  },
});

export default store;
