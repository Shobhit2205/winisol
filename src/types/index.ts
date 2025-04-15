export interface Lottery {
  id : number
  lotteryName: string,
  lotterySymbol: string
  lotteryURI: string
  startTime: number
  endTime: number
  price: number
  potAmount: number
  totalTickets: number
  image: string
  winnerChosen: boolean
  winnerPublicKey: string
  winnerTicketId: string
  sbRandomnessPubKey: string
  sbQueuePubKey: string
  winnerDeclaredTime: number
  initializeConfigSignature: string
  initializeLotterySignature: string
  createRandomnessSignature: string
  commitRandomnessSignature: string
  revealWinnerSignature: string
  priceClaimed: boolean
  priceClaimedSignature: string
  priceClaimedTime: Date
  authorityPriceClaimedSignature: string
  authorityPriceClaimed: boolean
  authorityPriceClaimedTime: Date
  createdAt: Date
}


export interface LotteryDetails {
    id: number,
    lotteryName: string,
    lotterySymbol: string,
    lotteryURI: string,
    lotteryImage: string,
    startTime: number,
    endTime: number,
    price: number,
    potAmount: number,
}

export interface CreateLotteryArgs {
    success: boolean,
    message: string,
    lottery: LotteryDetails,
}

export interface GetLotteries {
    lotteryId: number,
    lotteryName: string,
    lotterySymbol: string,
    startTime: number,
    endTime: number,
    price: number,
    potAmount: number,
    totalTickets: number,
    lotteryImage: string,
    winnerChosen: boolean,
    winnerPublicKey: string,
}

export interface GetAllLotteriesArgs {
    success: boolean,
    message: string,
    lotteries: Lottery[],
}

export interface SingleLotteryDetail {
    id : number
    lotteryName : string
    lotterySymbol : string
    lotteryURI : string
    startTime : number
    endTime : number
    price : number
    potAmount : number
    totalTickets : number
    image : string
    winnerChosen : boolean,
    winnerPublicKey : string,
    initializeConfigSignature : string
    initializeLotterySignature : string
    createRandomnessSignature : string
    commitRandomnessSignature : string
    revealWinnerSignature : string
    priceClaimed : boolean
    priceClaimedSignature : string
    createdAt : string
}

export interface LotteryDetailsResponse {
    success: boolean,
    message: string,
    lottery: SingleLotteryDetail
}

export interface WinningData {
    success: boolean,
    message: string,
    currentWinnings : {
        count: number,
        lotteries: Lottery[]
    },
    previousWinnings : {
        count: number,
        lotteries: Lottery[]
    }
}

export interface LimitedLottery {
    id: number,
    lotteryName: string,
    lotterySymbol: string,
    lotteryURI: string,
    image: string,
    totalPotAmount: number,
    totalTickets: number,
    ticketBought: string[],
    numberOfTicketSold: number
    price: number,
    winnerChosen: boolean
    winnerPublicKey: string
    winnerTicketId: string
    sbRandomnessPubKey: string
    sbQueuePubKey: string
    winnerDeclaredTime: number
    initializeConfigSignature: string
    initializeLotterySignature: string
    createRandomnessSignature: string
    commitRandomnessSignature: string
    revealWinnerSignature: string
    priceClaimed: boolean
    priceClaimedSignature: string
    priceClaimedTime: Date
    authorityPriceClaimedSignature: string
    authorityPriceClaimed: boolean
    authorityPriceClaimedTime: Date
    createdAt: Date
}
export interface GetAllLimitedLotteriesArgs {
    success: boolean,
    message: string,
    lotteries: LimitedLottery[]
}

export interface CreateLimitedLotteryInputArgs {
    totalTickets: number;
    price: number;
    lotteryImage: string;
    lotteryName: string;
    lotterySymbol: string;
    lotteryURI: string;
}

export interface Winnings {
    id: number,
    lotteryName: string,
    lotterySymbol: string,
    lotteryURI: string,
    price: number,
    winnings: number,
    winnerPublicKey: string,
    winnerTicketId: string,
    priceClaimed: boolean,
    priceClaimedSignature: string | null,
    priceClaimedTime: Date | null,
}