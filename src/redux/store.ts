import { configureStore } from '@reduxjs/toolkit';
import winningsReducer from './slices/winningsSlice';
import lotteriesReducer from './slices/lotteriesSlice';
import limitedLotteriesReducer from './slices/limitedLotterySlice';

const store = configureStore({
  reducer: {
    winnings: winningsReducer,
    lotteries: lotteriesReducer,
    limitedLotteries: limitedLotteriesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
