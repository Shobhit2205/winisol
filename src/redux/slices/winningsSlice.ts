
import { currentWinnings, previousWinnings } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WinningsState {
  currentWinnings: currentWinnings[];
  previousWinnings: previousWinnings[];
  isLoading: boolean;
}

const initialState: WinningsState = {
  currentWinnings: [],
  previousWinnings: [],
  isLoading: false,
};

const winningsSlice = createSlice({
  name: 'winnings',
  initialState,
  reducers: {
    setCurrentWinnings: (state, action: PayloadAction<currentWinnings[]>) => {
      state.currentWinnings = action.payload;
    },
    setPreviousWinnings: (state, action: PayloadAction<previousWinnings[]>) => {
      state.previousWinnings = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCurrentWinnings, setPreviousWinnings, setIsLoading } = winningsSlice.actions;
export default winningsSlice.reducer;
