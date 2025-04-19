import { configureStore } from '@reduxjs/toolkit';
import winningsReducer from './slices/winningsSlice';
import lotteriesReducer from './slices/lotteriesSlice';
import limitedLotteriesReducer from './slices/limitedLotterySlice';
import recentWinnersReducer from './slices/recentWinnersSlice';

const store = configureStore({
  reducer: {
    winnings: winningsReducer,
    lotteries: lotteriesReducer,
    limitedLotteries: limitedLotteriesReducer,
    recentWinners: recentWinnersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
