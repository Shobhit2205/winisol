import { Lottery } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LotteriesState {
    lotteries: Lottery[];
    isLotteriesLoading: boolean;
    lotteryError: string | null;
}

const initialState: LotteriesState = {
    lotteries: [],
    isLotteriesLoading: false,
    lotteryError: null,
};

const lotteriesSlice = createSlice({
    name: 'lotteries',
    initialState,
    reducers: {
        setLotteries: (state, action: PayloadAction<Lottery[]>) => {
            state.lotteries = action.payload;
        },
        setIsLotteriesLoading: (state, action: PayloadAction<boolean>) => {
            state.isLotteriesLoading = action.payload;
        },
        setLotteryError: (state, action: PayloadAction<string>) => {
            state.lotteryError = action.payload;
        },
        updateLottery: (state, action) => {
            const { lotteryId } = action.payload;
            const lottery = state.lotteries.find((lotto) => lotto.id === lotteryId);
            if (lottery) {
              lottery.totalTickets += 1;
              lottery.potAmount += lottery.price;
            }
        },
    },
});
  
export const { setLotteries, setIsLotteriesLoading, setLotteryError, updateLottery } = lotteriesSlice.actions;
export default lotteriesSlice.reducer;