
import { Winnings } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WinningsState {
  currentWinnings: Winnings[];
  previousWinnings: Winnings[];
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
    setCurrentWinnings: (state, action: PayloadAction<Winnings[]>) => {
      state.currentWinnings = action.payload;
    },
    setPreviousWinnings: (state, action: PayloadAction<Winnings[]>) => {
      state.previousWinnings = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCurrentWinnings, setPreviousWinnings, setIsLoading } = winningsSlice.actions;
export default winningsSlice.reducer;
