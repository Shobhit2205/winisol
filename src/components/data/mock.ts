export const FAQs = [
    {
        id: 1,
        question: 'What is WiniSol?',
        answer: 'WiniSol is a decentralized lottery platform that allows users to participate in a variety of lotteries. The platform is built on the Solana blockchain, which ensures that all transactions are secure and transparent.'
    },
    {
        id: 2,
        question: 'How does WiniSol work?',
        answer: 'WiniSol uses smart contracts on the Solana blockchain to create and manage lotteries. Users can purchase tickets for a chance to win prizes, and the winners are selected through a provably fair randomness.'
    },
    {
        id: 3,
        question: 'How do I participate in a lottery?',
        answer: 'Simply choose a lottery pool, buy the ticket, and wait for the draw! The winner is selected automatically when the lottery ends'
    },
    {
        id: 4,
        question: 'How is the winner selected?',
        answer: 'We use a fair algorithm running on a Solana smart contract. The process is fully automated, ensuring 100% fair and transparent results.'
    },
    {
        id: 5,
        question: 'How long does it take to receive winnings?',
        answer: 'If you win, you can claim you winning instantly—no delays'
    },
    {
        id: 6,
        question: 'Can I enter multiple pools at the same time?',
        answer: 'Yes! You can buy multiple tickets and enter different pools to increase your chances of winning.'
    },
    {
        id: 7,
        question: 'Is my money safe?',
        answer: 'Absolutely. Your funds are securely locked in a smart contract, and the draw is completely tamperproof.'
    },
    {
        id: 8,
        question: 'What wallets can I use?',
        answer: 'We support Phantom, Backpack, Solflare, and other Solana-compatible wallets for quick and secure transactions.'
    },
    {
        id: 9,
        question: 'Do I need to create an account to use WiniSol?',
        answer: 'No, WiniSol does not require any account creation. You can participate directly by connecting your Solana wallet.'
    },
    {
        id: 10,
        question: 'Are there any fees for participating in a lottery?',
        answer: 'WiniSol charges a minimal transaction fee to cover network costs, but there are no hidden charges.'
    },
    {
        id: 11,
        question: 'Is WiniSol legal in my country?',
        answer: 'WiniSol operates on a decentralized blockchain, but you should check your local regulations to ensure participation is permitted.'
    },
    {
        id: 12,
        question: 'Can I cancel my ticket after purchase?',
        answer: 'No, once a ticket is purchased, it cannot be canceled or refunded but since the ticket is NFT you can sell it to someone else.'
    },
    {
        id: 13,
        question: 'How can I check the lottery results?',
        answer: 'Lottery results are published on-chain and can be verified through the Solana blockchain explorer or directly on the WiniSol platform.'
    },
    {
        id: 14,
        question: 'What if I encounter a transaction failure?',
        answer: 'Ensure you have enough SOL for transaction fees. If issues persist, try reconnecting your wallet or checking the Solana network status.'
    },
    {
        id: 15,
        question: 'Is WiniSol truly decentralized?',
        answer: 'Yes, WiniSol operates fully on the Solana blockchain with smart contracts handling all transactions in a trustless manner.'
    },
    {
        id: 16,
        question: 'What are the types of lottery pools on WiniSol?',
        answer: 'WiniSol has two pool types: Timely and Limited Ticket. Timely ends after a set time—winner gets 90% of the prize. Limited Ticket ends when all tickets are sold—winner gets 100%.'
    },
    {
        id: 17,
        question: 'What happens if I don’t win?',
        answer: 'If you don’t win, you can burn your NFT ticket to reclaim the minting fee. Just make sure not to burn your ticket before the draw ends, or you’ll lose eligibility to claim winnings.'
    },
    {
        id: 18,
        question: 'Can I transfer or resell my ticket?',
        answer: 'Yes! Since your ticket is an NFT, you can transfer or even sell it to someone else using any Solana-compatible marketplace.'
    },
    {
        id: 19,
        question: 'Is the randomness verifiable?',
        answer: 'Yes, the winner is selected using Switchboard VRF, a decentralized randomness oracle. This ensures that the results are transparent, tamperproof, and verifiable on-chain.'
    },
    {
        id: 20,
        question: 'What is the minimum amount to join a lottery?',
        answer: 'Each lottery has a fixed ticket price which is clearly mentioned before you join. There’s no extra or hidden fee apart from this ticket cost and a minimal Solana network fee.'
    },
    {
        id: 21,
        question: 'Is there a limit to how many tickets I can buy?',
        answer: 'No, there’s no hard limit. You can buy as many tickets as you like, increasing your chances of winning.'
    },
]

export const WorkingData = [
    {
        id: 1,
        step: 1,
        title: 'Pick Your Lottery Pool',
        description: 'Choose from a variety of pools with different prize amounts and ticket prices.'
    },
    {
        id: 2,
        step: 2,
        title: 'Buy Your Ticket',
        description: 'Purchase a ticket for the pool of your choice using your Solana wallet.'
    },
    {
        id: 3,
        step: 3,
        title: 'Wait for the Draw & Win Instantly',
        description: 'As soon as the countdown is over, the draw starts, You can claim your sol instantly after wining.'
    },
]

export const LotteryData = [
    {
        lotteryId: 1,
        lotteryName: 'King Lottery',
        lotterySymbol: 'KL',
        lotteryImage: 'https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png',
        startTime: 1742644889,
        endTime: 1744439489,
        potAmount: 100000000000,
        totalTickets: 100,
        price: 1000000000,
        priceClaimedSignature: "2SsdZFuZDmeJZZZEzkbeRsijWLYTNw5EB2RXLNm7YQjpJ2tdRjRtb3bKF8HVwHxvHfJoFvYNHMao4LbqfWHUSz6H",
    },
    {
        lotteryId: 2,
        lotteryName: 'Queen Lottery',
        lotterySymbol: 'QL',
        lotteryImage: 'https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png',
        startTime: 1742644889,
        endTime: 1744439489,
        potAmount: 80000000000,
        totalTickets: 200,
        price: 800000000,
        priceClaimedSignature: "2SsdZFuZDmeJZZZEzkbeRsijWLYTNw5EB2RXLNm7YQjpJ2tdRjRtb3bKF8HVwHxvHfJoFvYNHMao4LbqfWHUSz6H",
    },
    {
        lotteryId: 3,
        lotteryName: 'Bishop Lottery',
        lotterySymbol: 'BL',
        lotteryImage: 'https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png',
        startTime: 1742644889,
        endTime: 1744439489,
        potAmount: 70000000000,
        totalTickets: 60,
        price: 600000000,
        priceClaimedSignature: "2SsdZFuZDmeJZZZEzkbeRsijWLYTNw5EB2RXLNm7YQjpJ2tdRjRtb3bKF8HVwHxvHfJoFvYNHMao4LbqfWHUSz6H",
    },
    {
        lotteryId: 4,
        lotteryName: 'Knight Lottery',
        lotterySymbol: 'HL',
        lotteryImage: 'https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png',
        startTime: 1742644889,
        endTime: 1744439489,
        potAmount: 50000000000,
        totalTickets: 50,
        price: 500000000,
        priceClaimedSignature: "2SsdZFuZDmeJZZZEzkbeRsijWLYTNw5EB2RXLNm7YQjpJ2tdRjRtb3bKF8HVwHxvHfJoFvYNHMao4LbqfWHUSz6H",
    },
    {
        lotteryId: 5,
        lotteryName: 'Rock Lottery',
        lotterySymbol: 'KL',
        lotteryImage: 'https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png',
        startTime: 1742644889,
        endTime: 1744439489,
        potAmount: 10000000000,
        totalTickets: 10,
        price: 100000000,
        priceClaimedSignature: "2SsdZFuZDmeJZZZEzkbeRsijWLYTNw5EB2RXLNm7YQjpJ2tdRjRtb3bKF8HVwHxvHfJoFvYNHMao4LbqfWHUSz6H",
    },
    {
        lotteryId: 6,
        lotteryName: 'Pawn Lottery',
        lotterySymbol: 'EL',
        lotteryImage: 'https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png',
        startTime: 1742644889,
        endTime: 1744439489,
        potAmount: 10000000000,
        totalTickets: 10,
        price: 10000000,
        priceClaimedSignature: "2SsdZFuZDmeJZZZEzkbeRsijWLYTNw5EB2RXLNm7YQjpJ2tdRjRtb3bKF8HVwHxvHfJoFvYNHMao4LbqfWHUSz6H",
    },
]

export const dummyLottery = {
    id: 1,
    lotteryName: "Mega Jackpot",
    lotterySymbol: "MJACK",
    lotteryURI: "https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png",
    startTime: BigInt(Date.now()),
    endTime: BigInt(Date.now() + 86400000),
    price: 10.5,
    potAmount: 5000.75,
    totalTickets: 150,
    image: "https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png",
    winnerChosen: false,
    winnerPublicKey: "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A",
    initializeConfigSignature: "35Mb8AAyEyHrvh3aE7ENMekwF47HAtbU1G1VtVXy6vSvsJhri8XPptwLiF8gd3NrxCeQBQcx2oEKwq96tAeVXbzE",
    initializeLotterySignature: "35Mb8AAyEyHrvh3aE7ENMekwF47HAtbU1G1VtVXy6vSvsJhri8XPptwLiF8gd3NrxCeQBQcx2oEKwq96tAeVXbzE",
    createRandomnessSignature: "35Mb8AAyEyHrvh3aE7ENMekwF47HAtbU1G1VtVXy6vSvsJhri8XPptwLiF8gd3NrxCeQBQcx2oEKwq96tAeVXbzE",
    commitRandomnessSignature: "35Mb8AAyEyHrvh3aE7ENMekwF47HAtbU1G1VtVXy6vSvsJhri8XPptwLiF8gd3NrxCeQBQcx2oEKwq96tAeVXbzE",
    revealWinnerSignature: "35Mb8AAyEyHrvh3aE7ENMekwF47HAtbU1G1VtVXy6vSvsJhri8XPptwLiF8gd3NrxCeQBQcx2oEKwq96tAeVXbzE",
    priceClaimed: false,
    priceClaimedSignature: "35Mb8AAyEyHrvh3aE7ENMekwF47HAtbU1G1VtVXy6vSvsJhri8XPptwLiF8gd3NrxCeQBQcx2oEKwq96tAeVXbzE",
    createdAt: new Date().toISOString(),
};

export const RecentWinnersData = [
    {
        id: 1,
        walletAddress: "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A",
        lotteryId: 1,
        lotteryName: "King Lottery",
        winningAmount: 100,
        TimeWon: '2 hours ago',
    },
    {
        id: 2,
        walletAddress: "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A",
        lotteryId: 2,
        lotteryName: "Queen Lottery",
        winningAmount: 100,
        TimeWon: '2 hours ago',
    },
    {
        id: 3,
        walletAddress: "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A",
        lotteryId: 3,
        lotteryName: "Bishop Lottery",
        winningAmount: 100,
        TimeWon: '2 hours ago',
    },
    {
        id: 4,
        walletAddress: "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A",
        lotteryId: 4,
        lotteryName: "Knight Lottery",
        winningAmount: 100,
        TimeWon: '2 hours ago',
    },
    {
        id: 5,
        walletAddress: "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A",
        lotteryId: 5,
        lotteryName: "Rock Lottery",
        winningAmount: 100,
        TimeWon: '2 hours ago',
    },
    {
        id: 6,
        walletAddress: "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A",
        lotteryId: 6,
        lotteryName: "Pawn Lottery",
        winningAmount: 100,
        TimeWon: '2 hours ago',
    },
]

export const LimitedLotteryData = [
    {
        id: 1,
        lotteryName: "Limited Lottery",
        lotterySymbol: "LL",
        lotteryImage: "https://res.cloudinary.com/shobhit2205/image/upload/v1744358216/Frame_134_jts9nu.svg",
        totalPotAmount: 50000000000,
        totalTickets: 5,
        ticketBought: [1,2,3],
        numberOfTicketSold: 3,
        price: 500000000,
    }
]