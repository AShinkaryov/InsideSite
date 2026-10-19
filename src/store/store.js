import { configureStore } from '@reduxjs/toolkit';
import questsReducer from './questsSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    quests: questsReducer,
    favorites: favoritesReducer,
  },
});