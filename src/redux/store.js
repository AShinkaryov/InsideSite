import { configureStore } from '@reduxjs/toolkit';
import questReducer from './questSlice';

export const store = configureStore({
  reducer: {
    quests: questReducer,
  },
});