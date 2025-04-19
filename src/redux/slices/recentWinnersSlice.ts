import { Winner } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface RecentWinnersState {
  winners: Winner[];
  isWinnersLoading: boolean;
  winnersError: string | null;
  total: number;
}

const initialState: RecentWinnersState = {
  winners: [],
  isWinnersLoading: false,
  winnersError: null,
  total: 0
};

const recentWinnersSlice = createSlice({
  name: 'recentWinners',
  initialState,
  reducers: {
    setWinners: (state, action: PayloadAction<Winner[]>) => {
      state.winners = action.payload;
    },
    setIsWinnersLoading: (state, action: PayloadAction<boolean>) => {
      state.isWinnersLoading = action.payload;
    },
    setWinnersError: (state, action: PayloadAction<string>) => {
      state.winnersError = action.payload;
    },
    setTotalWinners: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    addWinner: (state, action: PayloadAction<Winner>) => {
      state.winners = [action.payload, ...state.winners];
      state.total += 1;
    },
    updateWinner: (state, action: PayloadAction<{
      id: number;
      lotteryType: 'standard' | 'limited';
      updates: Partial<Winner>;
    }>) => {
      const { id, lotteryType, updates } = action.payload;
      const winner = state.winners.find(
        w => w.id === id && w.lotteryType === lotteryType
      );
      if (winner) {
        Object.assign(winner, updates);
      }
    },
    clearWinners: (state) => {
      state.winners = [];
      state.total = 0;
    }
  },
});

export const {
  setWinners,
  setIsWinnersLoading,
  setWinnersError,
  setTotalWinners,
  addWinner,
  updateWinner,
  clearWinners
} = recentWinnersSlice.actions;

export default recentWinnersSlice.reducer;