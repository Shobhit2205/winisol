import { LimitedLottery } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LimitedLotteriesState {
    limitedLotteries: LimitedLottery[];
    isLimitedLotteriesLoading: boolean;
    limitedLotteryError: string | null;
}

const initialState: LimitedLotteriesState = {
    limitedLotteries: [],
    isLimitedLotteriesLoading: false,
    limitedLotteryError: null,
};

const limitedLotteriesSlice = createSlice({
    name: 'limitedLotteries',
    initialState,
    reducers: {
        setLimitedLotteries: (state, action: PayloadAction<LimitedLottery[]>) => {
            state.limitedLotteries = action.payload;
        },
        setIsLimitedLotteriesLoading: (state, action: PayloadAction<boolean>) => {
            state.isLimitedLotteriesLoading = action.payload;
        },
        setLimitedLotteryError: (state, action: PayloadAction<string>) => {
            state.limitedLotteryError = action.payload;
        },
        updateLimitedLottery: (state, action) => {
            const { lotteryId, ticketIdentifier } = action.payload;
            const lottery = state.limitedLotteries.find((lotto) => lotto.id === lotteryId);
            if (lottery) {
              lottery.numberOfTicketSold += 1;
              lottery.ticketBought.push(ticketIdentifier);
            }
        },
    },
});
  
export const { setLimitedLotteries, setIsLimitedLotteriesLoading, setLimitedLotteryError, updateLimitedLottery } = limitedLotteriesSlice.actions;
export default limitedLotteriesSlice.reducer;