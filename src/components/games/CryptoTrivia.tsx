import React, { useState, useEffect, useContext, useRef  } from 'react';
import { X, Trophy, Timer, ArrowLeft, Brain, Check, X as XIcon, Heart, Zap, Shield, Clock } from 'lucide-react';
import { GameSession } from '../GamesModal';
import { useStore } from '../../store/useStore';

import { Web3AuthContext } from '../../providers/Web3AuthContext.tsx';
import { GameService } from '../../services/game.services.ts';

interface CryptoTriviaProps {
  gameType?: string;
}
interface GameState {
  screen: 'menu' | 'difficulty' | 'game' | 'results';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  currentQuestion: number;
  score: number;
  timeLeft: number;
  answers: boolean[];
  highScore: number;
  bestStreak: number;
  totalTokens: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  lives: number;
  powerups: {
    fiftyFifty: boolean;
    timeFreeze: boolean;
    doublePoints: boolean;
  };
  streak: number;
  multiplier: number;
}


interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Basics' | 'Technical' | 'DeFi' | 'NFTs' | 'History' | 'Meme';
}

const QUESTION_BANK: Question[] = [
  {
    question: "What is Bitcoin's maximum supply?",
    answers: ["21 Million", "18 Million", "100 Million", "Unlimited"],
    correctAnswer: 0,
    explanation: "Bitcoin has a fixed maximum supply of 21 million coins, which helps maintain its scarcity and value proposition as a deflationary asset.",
    difficulty: 'Easy',
    category: 'Basics'
  },

  {
    question: "What consensus mechanism does Ethereum 2.0 use?",
    answers: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Proof of History"],
    correctAnswer: 1,
    explanation: "Ethereum 2.0 transitioned to Proof of Stake to improve scalability, energy efficiency, and reduce environmental impact.",
    difficulty: 'Medium',
    category: 'Technical'
  },
  {
    question: "What is a smart contract?",
    answers: [
      "A legal document",
      "Self-executing code on blockchain",
      "A trading agreement",
      "A wallet type"
    ],
    correctAnswer: 1,
    explanation: "Smart contracts are self-executing contracts with the terms directly written into code, enabling trustless and automated transactions.",
    difficulty: 'Easy',
    category: 'Basics'
  },
  {
    question: "What is DeFi?",
    answers: [
      "Decentralized Finance",
      "Digital Finance",
      "Direct Finance",
      "Distributed Finance"
    ],
    correctAnswer: 0,
    explanation: "DeFi refers to financial services built on blockchain technology that operate without traditional intermediaries like banks.",
    difficulty: 'Easy',
    category: 'DeFi'
  },
  {
    question: "What is a blockchain fork?",
    answers: [
      "A cryptocurrency split",
      "A mining tool",
      "A wallet backup",
      "A trading strategy"
    ],
    correctAnswer: 0,
    explanation: "A fork occurs when a blockchain diverges into two paths, creating two separate versions. This can be either soft (backward-compatible) or hard (incompatible).",
    difficulty: 'Medium',
    category: 'Technical'
  },
  {
    question: "What is a private key used for?",
    answers: [
      "Website login",
      "Mining cryptocurrency",
      "Accessing your wallet",
      "Creating tokens"
    ],
    correctAnswer: 2,
    explanation: "Private keys are cryptographic keys that give you control over your cryptocurrency wallet and allow you to sign transactions.",
    difficulty: 'Easy',
    category: 'Basics'
  },
  {
    question: "What is a DEX?",
    answers: [
      "Digital Exchange",
      "Decentralized Exchange",
      "Direct Exchange",
      "Distributed Exchange"
    ],
    correctAnswer: 1,
    explanation: "A DEX is a decentralized exchange that operates using smart contracts, allowing direct peer-to-peer trading without intermediaries.",
    difficulty: 'Easy',
    category: 'DeFi'
  },
  {
    question: "What is 'gas' in Ethereum?",
    answers: [
      "Network fuel",
      "A token type",
      "Mining reward",
      "Exchange fee"
    ],
    correctAnswer: 0,
    explanation: "Gas is the fee required to perform transactions on the Ethereum network, measured in units of computation called 'gas units'.",
    difficulty: 'Medium',
    category: 'Technical'
  },
  {
    question: "What is a Layer 2 solution?",
    answers: [
      "A new blockchain",
      "A scaling solution",
      "A wallet type",
      "A mining protocol"
    ],
    correctAnswer: 1,
    explanation: "Layer 2 solutions are built on top of existing blockchains to improve scalability by processing transactions off the main chain.",
    difficulty: 'Hard',
    category: 'Technical'
  },
  {
    question: "What is staking?",
    answers: [
      "Trading strategy",
      "Mining method",
      "Holding tokens to validate",
      "Token burning"
    ],
    correctAnswer: 2,
    explanation: "Staking involves locking up tokens to participate in network validation and earn rewards in Proof of Stake systems.",
    difficulty: 'Medium',
    category: 'DeFi'
  },
  {
    question: "What is an NFT?",
    answers: [
      "Non-Fungible Token",
      "New Financial Tool",
      "Network File Transfer",
      "Node Function Type"
    ],
    correctAnswer: 0,
    explanation: "NFTs are unique digital assets that represent ownership of specific items or content on the blockchain.",
    difficulty: 'Easy',
    category: 'NFTs'
  },
  {
    question: "What was the first NFT collection on Ethereum?",
    answers: [
      "CryptoPunks",
      "Bored Apes",
      "CryptoKitties",
      "Meebits"
    ],
    correctAnswer: 0,
    explanation: "CryptoPunks, launched in 2017, was the first NFT collection on Ethereum and inspired the ERC-721 standard.",
    difficulty: 'Hard',
    category: 'History'
  },
  {
    question: "What is a liquidity pool?",
    answers: [
      "A cryptocurrency savings account",
      "A pair of tokens for trading",
      "A mining pool",
      "A type of wallet"
    ],
    correctAnswer: 1,
    explanation: "A liquidity pool is a pair of tokens locked in a smart contract to enable decentralized trading on DEXes.",
    difficulty: 'Medium',
    category: 'DeFi'
  },
  {
    question: "What is a flash loan?",
    answers: [
      "A quick personal loan",
      "An uncollateralized DeFi loan",
      "A high-interest loan",
      "A long-term crypto loan"
    ],
    correctAnswer: 1,
    explanation: "Flash loans are uncollateralized loans in DeFi that must be borrowed and repaid within the same transaction block.",
    difficulty: 'Hard',
    category: 'DeFi'
  },
  {
    question: "What is the ERC-20 standard?",
    answers: [
      "A token standard",
      "A blockchain protocol",
      "A wallet format",
      "A mining algorithm"
    ],
    correctAnswer: 0,
    explanation: "ERC-20 is a technical standard for fungible tokens on the Ethereum blockchain, defining a common set of rules for tokens to follow.",
    difficulty: 'Medium',
    category: 'Technical'
  },
  {
    question: "Who is the creator of Bitcoin?",
    answers: ["Gavin Wood", "Vitalik Buterin", "Satoshi Nakamoto", "Hal Finney"],
    correctAnswer: 2,
    explanation: "Satoshi Nakamoto is the pseudonymous creator of Bitcoin who published the Bitcoin whitepaper in 2008 and released the first Bitcoin software in 2009. Their true identity remains unknown.",
    difficulty: 'Easy',
    category: 'Basics'
  },
  {
    question: "What is the first cryptocurrency ever created?",
    answers: ["Ethereum", "Litecoin", "Dogecoin", "Bitcoin"],
    correctAnswer: 3,
    explanation: "Bitcoin was the first cryptocurrency ever created, launched in January 2009 by Satoshi Nakamoto. It introduced the concept of a decentralized digital currency using blockchain technology.",
    difficulty: 'Easy',
    category: 'Basics'
  },

{
  question: "What is the primary purpose of blockchain technology?",
  answers: ["To mine cryptocurrency", "To create NFTs", "To securely record transactions", "To control inflation"],
  correctAnswer: 2,
  explanation: "Blockchain technology was designed to securely record transactions in a decentralized, immutable ledger that doesn't require a trusted third party, enabling peer-to-peer transactions with cryptographic verification.",
  difficulty: 'Easy',
  category: 'Basics'
},

{
  question: "What year was Bitcoin created?",
  answers: ["2009", "2005", "2011", "2013"],
  correctAnswer: 0,
  explanation: "Bitcoin was created in 2009 when Satoshi Nakamoto mined the genesis block (block 0) on January 3rd, shortly after publishing the Bitcoin whitepaper in October 2008.",
  difficulty: 'Easy',
  category: 'Basics'
},

{
  question: `What does "HODL" stand for in the crypto community?`,
  answers: ["Hold Onto Digital Leverage", "Hold On for Dear Life", "Huge Online Data Ledger", "Help Others Develop Liquidity"],
  correctAnswer: 1,
  explanation: `"HODL" originated from a typo of "HOLD" in a 2013 Bitcoin forum post, but was later backronymed to mean "Hold On for Dear Life." It refers to keeping your cryptocurrency through market volatility rather than selling.`,
  difficulty: 'Easy',
  category: 'Basics'
},

{
  question: "What is the smallest unit of Bitcoin called?",
  answers: ["Block", "Satoshi", "MicroBitcoin", "NanoBTC"],
  correctAnswer: 1,
  explanation: "A Satoshi is the smallest unit of Bitcoin, equal to 0.00000001 BTC (one hundred millionth of a Bitcoin). It was named after Bitcoin's creator, Satoshi Nakamoto.",
  difficulty: 'Easy',
  category: 'Basics'
},

{
  question: "What is Ethereum primarily used for?",
  answers: ["Smart contracts and DApps", "Bitcoin mining", "Cross-border payments", "Privacy transactions"],
  correctAnswer: 0,
  explanation: "Ethereum is primarily used for smart contracts and decentralized applications (DApps), which extend blockchain functionality beyond simple transactions to programmable agreements and complex applications.",
  difficulty: 'Easy',
  category: 'Basics'
},

{
  question: "What is the symbol for Bitcoin?",
  answers: ["ETH", "BTC", "BCH", "DOGE"],
  correctAnswer: 1,
  explanation: "BTC is the standard symbol for Bitcoin in cryptocurrency markets, though it is also sometimes represented as XBT, particularly in international markets following ISO currency codes.",
  difficulty: 'Easy',
  category: 'Basics'
},

{
  question: `What does the term "Altcoin" refer to?`,
  answers: ["A new blockchain", "A hard fork of Bitcoin", "Any cryptocurrency other than Bitcoin", "A mining pool"],
  correctAnswer: 2,
  explanation: "Altcoin is a portmanteau of 'alternative' and 'coin', referring to any cryptocurrency other than Bitcoin. Examples include Ethereum, Litecoin, Ripple, and thousands of others.",
  difficulty: 'Easy',
  category: 'Basics'
},

{
  question: "What is a private key in cryptocurrency?",
  answers: ["A secret code that allows access to your crypto wallet", "A password for crypto exchanges", "The public address for receiving funds", "A hardware wallet backup"],
  correctAnswer: 0,
  explanation: "A private key is a secure cryptographic code that allows access to your cryptocurrency holdings. It's essentially the password that proves ownership and enables you to send transactions from your wallet.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "What is the primary consensus mechanism used by Bitcoin?",
  answers: ["Proof of Stake (PoS)", "Delegated Proof of Stake (DPoS)", "Proof of Work (PoW)", "Byzantine Fault Tolerance (BFT)"],
  correctAnswer: 2,
  explanation: "Proof of Work (PoW) is Bitcoin's consensus mechanism, where miners compete to solve complex mathematical puzzles, with the winner getting to add the next block and receive rewards.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "What is the native cryptocurrency of the Binance exchange?",
  answers: ["BNB", "BTC", "BUSD", "ETH"],
  correctAnswer: 0,
  explanation: "BNB (Binance Coin) is the native cryptocurrency of Binance, originally created on Ethereum but now operating on Binance's own blockchain. It's used for trading fee discounts and various applications in the Binance ecosystem.",
  difficulty: 'Medium',
  category: 'Basics'
},
{
  question: "Which token standard is used for most Ethereum-based tokens?",
  answers: ["ERC-721", "ERC-20", "ERC-1155", "BEP-20"],
  correctAnswer: 1,
  explanation: "ERC-20 is the most widely used token standard on Ethereum, defining a common set of rules for fungible tokens. It enabled the creation of thousands of different tokens on the Ethereum blockchain.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "What is a crypto wallet?",
  answers: ["A bank account for crypto", "A digital tool to store, send, and receive cryptocurrencies", "A mining rig accessory", "An NFT marketplace feature"],
  correctAnswer: 1,
  explanation: "A crypto wallet is a digital tool that stores the private keys needed to access, send, and receive your cryptocurrency. It doesn't actually store the coins themselves, which exist on the blockchain.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "What is the purpose of a smart contract?",
  answers: ["To generate Bitcoin", "To automatically execute agreements based on predefined conditions", "To enable high-frequency trading", "To secure crypto wallets"],
  correctAnswer: 1,
  explanation: "Smart contracts automatically execute predefined conditions without intermediaries, enabling trustless agreements. They're self-executing contracts with terms directly written into code on platforms like Ethereum.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "What is the term for the process of validating transactions on a blockchain?",
  answers: ["Coding", "Staking", "Mining", "Forking"],
  correctAnswer: 2,
  explanation: "Mining is the process of validating transactions and adding them to a blockchain, particularly in Proof of Work systems where miners compete to solve cryptographic puzzles to earn the right to add blocks.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "Who co-founded Ethereum alongside Vitalik Buterin?",
  answers: ["Gavin Wood and Joseph Lubin", "Satoshi Nakamoto and Charlie Lee", "Hal Finney and Nick Szabo", "Elon Musk and Changpeng Zhao"],
  correctAnswer: 0,
  explanation: "Gavin Wood and Joseph Lubin were key co-founders of Ethereum alongside Vitalik Buterin. Wood wrote the Ethereum Yellow Paper and created Solidity, while Lubin founded ConsenSys, a major Ethereum software company.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "What is a hard fork in blockchain?",
  answers: ["A security upgrade", "A significant protocol change that splits the blockchain", "A network crash", "A type of mining algorithm"],
  correctAnswer: 1,
  explanation: "A hard fork is a major protocol change that creates incompatibility between old and new versions, effectively splitting the blockchain into two separate paths, requiring all nodes to upgrade or stay on the old chain.",
  difficulty: 'Medium',
  category: 'Basics'
},

{
  question: "What is the hash algorithm used by Bitcoin?",
  answers: ["SHA-256", "SHA-512", "Blake2b", "Keccak-256"],
  correctAnswer: 0,
  explanation: "SHA-256 (Secure Hash Algorithm 256-bit) is the cryptographic hash function used by Bitcoin for its Proof of Work mining algorithm and for generating addresses from public keys.",
  difficulty: 'Hard',
  category: 'Basics'
},

{
  question: "Which cryptocurrency introduced the concept of staking?",
  answers: ["Peercoin (PPC)", "Ethereum", "Cardano", "Solana"],
  correctAnswer: 0,
  explanation: "Peercoin (PPC) was the first cryptocurrency to introduce the concept of staking (Proof of Stake) in 2012, allowing coin holders to earn rewards for helping secure the network based on the coins they hold.",
  difficulty: 'Hard',
  category: 'Basics'
},

{
  question: "What is the Byzantine Generals Problem in blockchain?",
  answers: ["A security vulnerability in smart contracts", "A situation describing how decentralized parties can agree without trust", "A method for increasing transaction speeds", "A type of attack on private keys"],
  correctAnswer: 1,
  explanation: "The Byzantine Generals Problem is a game theory problem that illustrates how decentralized parties can reach consensus without trusting each other, which blockchain technology solves through its consensus mechanisms.",
  difficulty: 'Hard',
  category: 'Basics'
},

{
  question: "What year did Ethereum launch?",
  answers: ["2013", "2014", "2015", "2016"],
  correctAnswer: 2,
  explanation: "Ethereum launched in July 2015, approximately two years after Vitalik Buterin published the Ethereum whitepaper in 2013. The network went live with its genesis block on July 30, 2015.",
  difficulty: 'Hard',
  category: 'Basics'
},

{
  question: "What does zk-SNARK stand for?",
  answers: ["Zero-Knowledge Succinct Non-Interactive Argument of Knowledge", "Zero-Knowledge Shared Network Algorithm Key", "Zero-Knowledge Smart Non-Interactive Relay Key", "Zero-Knowledge Synchronized Asset Recovery Kit"],
  correctAnswer: 0,
  explanation: "zk-SNARK stands for 'Zero-Knowledge Succinct Non-Interactive Argument of Knowledge', a cryptographic method that allows one party to prove they possess certain information without revealing the information itself.",
  difficulty: 'Hard',
  category: 'Basics'
},

{
  question: "Which blockchain hosts the majority of DeFi projects?",
  answers: ["Ethereum", "Solana", "Binance Smart Chain", "Cardano"],
  correctAnswer: 0,
  explanation: "Ethereum hosts the majority of DeFi projects due to its robust smart contract functionality, established ecosystem, and first-mover advantage in the space, despite challenges with scalability and high gas fees.",
  difficulty: 'Easy',
  category: 'DeFi'
},

{
  question: `What is "yield farming"?`,
  answers: ["Mining Bitcoin", "Earning rewards by providing liquidity to DeFi protocols", "Growing crops in the metaverse", "Trading tokens at a profit"],
  correctAnswer: 1,
  explanation: "Yield farming involves providing liquidity to DeFi protocols to earn rewards, typically in the form of interest, transaction fees, or governance tokens that can significantly boost overall returns.",
  difficulty: 'Easy',
  category: 'DeFi'
},

{
  question: `What does "TVL" stand for in DeFi?`,
  answers: ["Total Value Loaned", "Total Virtual Leverage", "Total Value Locked", "Transaction Volume Limit"],
  correctAnswer: 2,
  explanation: "TVL (Total Value Locked) represents the total amount of assets deposited in a DeFi protocol, serving as a key metric for measuring a protocol's size, adoption, and overall health.",
  difficulty: 'Easy',
  category: 'DeFi'
},

{
  question: "What is impermanent loss in DeFi?",
  answers: ["Loss from holding stablecoins", "Loss incurred when providing liquidity due to price changes in pooled assets", "Loss from a hacked wallet", "Loss due to network downtime"],
  correctAnswer: 1,
  explanation: "Impermanent loss occurs when providing liquidity to an AMM pool, where the value of deposited assets changes compared to simply holding them, due to the pool's constant product formula adjusting to market prices.",
  difficulty: 'Medium',
  category: 'DeFi'
},

{
  question: `Which DeFi protocol introduced flash loans?`,
  answers: ["MakerDAO", "Aave", "Compound", "Curve Finance"],
  correctAnswer: 1,
  explanation: "Aave pioneered flash loans, which allow users to borrow assets without collateral as long as the loan is borrowed and repaid within a single transaction block, enabling various arbitrage and refinancing strategies.",
  difficulty: 'Medium',
  category: 'DeFi'
},

{
  question: `What is Curve Finance primarily used for?`,
  answers: ["Trading NFTs", "Swapping stablecoins", "Hosting decentralized exchanges", "Providing staking rewards"],
  correctAnswer: 1,
  explanation: "Curve Finance is primarily used for swapping stablecoins with minimal slippage, using specialized liquidity pools designed for trading assets of similar value, making it ideal for stablecoin exchanges.",
  difficulty: 'Medium',
  category: 'DeFi'
},

{
  question: `What does "APY" stand for in DeFi?`,
  answers: ["Annual Percentage Yield", "Automated Payment Yield", "Accrued Portfolio Year", "Annual Payment Year"],
  correctAnswer: 0,
  explanation: "APY (Annual Percentage Yield) is the rate of return earned on an investment over a year, accounting for the effect of compounding interest, commonly used to express yields in lending and liquidity protocols.",
  difficulty: 'Medium',
  category: 'DeFi'
},

{
  question: `What is Compound Finance used for?`,
  answers: ["Storing NFTs", "Token minting", "Lending and borrowing cryptocurrencies", "Gaming rewards"],
  correctAnswer: 2,
  explanation: "Compound Finance is a lending and borrowing protocol that allows users to deposit cryptocurrencies to earn interest or borrow assets against collateral, with algorithmically set interest rates based on supply and demand.",
  difficulty: 'Medium',
  category: 'DeFi'
},

{
  question: `What does AMM stand for in DeFi?`,
  answers: ["Autonomous Market Mining", "Automated Market Maker", "Algorithmic Monetary Model", "Asset Management Mechanism"],
  correctAnswer: 1,
  explanation: "AMM stands for Automated Market Maker, a type of decentralized exchange protocol that uses mathematical formulas and liquidity pools to price assets rather than traditional order books.",
  difficulty: 'Hard',
  category: 'DeFi'
},

{
  question: `What is "liquid staking"?`,
  answers: ["Staking while keeping tokens unlocked", "Staking assets while maintaining liquidity through derivative tokens", "Staking assets on multiple blockchains simultaneously", "Staking non-fungible tokens (NFTs)"],
  correctAnswer: 1,
  explanation: "Liquid staking allows users to stake their assets while receiving a derivative token representing their staked position, maintaining liquidity and enabling them to use their staked assets in other DeFi applications.",
  difficulty: 'Hard',
  category: 'DeFi'
},

{
  question: `Which DeFi protocol uses the Synthetix token (SNX)?`,
  answers: ["Aave", "Curve", "Synthetix", "Uniswap"],
  correctAnswer: 2,
  explanation: "Synthetix uses its native SNX token as collateral to mint synthetic assets (Synths) that track the value of real-world assets like stocks, commodities, and currencies on the blockchain.",
  difficulty: 'Hard',
  category: 'DeFi'
},

{
  question: `What is OlympusDAO known for in DeFi?`,
  answers: ["Flash loans", "Stablecoin development", "Protocol-owned liquidity", "Cross-chain swaps"],
  correctAnswer: 2,
  explanation: "OlympusDAO pioneered the concept of protocol-owned liquidity, where the protocol itself owns its liquidity rather than renting it from users, using a bonding mechanism to acquire its own assets.",
  difficulty: 'Hard',
  category: 'DeFi'
},

{
  question: `Which stablecoin is backed entirely by reserves of US dollars and treasuries?`,
  answers: ["DAI", "Tether (USDT)", "USD Coin (USDC)", "BUSD"],
  correctAnswer: 2,
  explanation: "USD Coin (USDC) is backed entirely by reserves of US dollars and US treasuries, with regular attestations of its reserves to maintain its 1:1 peg to the US dollar.",
  difficulty: 'Hard',
  category: 'DeFi'
},

{
  question: `What is the first meme coin ever created?`,
  answers: ["Shiba Inu (SHIB)", "Dogecoin (DOGE)", "Floki Inu", "Akita Inu"],
  correctAnswer: 1,
  explanation: "Dogecoin (DOGE) was the first meme coin ever created, launched in December 2013 by Billy Markus and Jackson Palmer as a joke based on the popular 'Doge' Shiba Inu meme.",
  difficulty: 'Easy',
  category: 'Meme'
},

{
  question: `What animal is the mascot of Dogecoin?`,
  answers: ["Labrador", "Husky", "Shiba Inu", "Golden Retriever"],
  correctAnswer: 2,
  explanation: "The Shiba Inu dog breed is the mascot of Dogecoin, specifically the dog from the popular 'Doge' meme that featured a Shiba with internal monologue phrases in colorful Comic Sans font.",
  difficulty: 'Easy',
  category: 'Meme'
},

{
  question: `Which meme coin was famously endorsed by Elon Musk?`,
  answers: ["Dogecoin (DOGE)", "Shiba Inu (SHIB)", "Baby Doge", "Akita Inu"],
  correctAnswer: 0,
  explanation: "Dogecoin (DOGE) was famously endorsed by Elon Musk through numerous tweets and public statements, including calling it the 'people's crypto' and mentioning it during his Saturday Night Live appearance.",
  difficulty: 'Easy',
  category: 'Meme'
},

{
  question: `What is the maximum supply of Dogecoin?`,
  answers: ["21 million", "1 quadrillion", "Unlimited", "100 billion"],
  correctAnswer: 2,
  explanation: "Unlike Bitcoin, Dogecoin has an unlimited supply with no maximum cap. It's inflationary by design, with approximately 5 billion new DOGE created each year through mining rewards.",
  difficulty: 'Easy',
  category: 'Meme'
},
{
  question: `What does "SHIB" stand for?`,
  answers: ["Super High Interest Blockchain", "Shiba Inu", "Secure Hash Incentive Blockchain", "Shiba Holder Incentive Base"],
  correctAnswer: 1,
  explanation: "SHIB is the ticker symbol for Shiba Inu token, named after the Japanese dog breed. It's not an acronym but refers to the same Shiba Inu dog breed that inspired Dogecoin.",
  difficulty: 'Easy',
  category: 'Meme'
},

{
  question: `What is the purpose of the ShibaSwap platform?`,
  answers: ["To trade and stake Shiba Inu tokens", "To mint new meme coins", "To mine Dogecoin", "To auction NFTs"],
  correctAnswer: 0,
  explanation: "ShibaSwap is the decentralized exchange (DEX) for the Shiba Inu ecosystem, allowing users to trade and stake Shiba Inu tokens (SHIB, LEASH, BONE) and providing various yield-generating opportunities.",
  difficulty: 'Medium',
  category: 'Meme'
},

{
  question: `Which meme coin donated $1 billion worth of tokens to COVID-19 relief?`,
  answers: ["Dogecoin", "SafeMoon", "Shiba Inu", "Floki Inu"],
  correctAnswer: 2,
  explanation: "Shiba Inu (SHIB) made headlines when Vitalik Buterin, who had been gifted 50% of the SHIB supply, donated approximately $1 billion worth of SHIB tokens to the India COVID-19 relief fund in 2021.",
  difficulty: 'Medium',
  category: 'Meme'
},

{
  question: `What is Baby Doge Coin?`,
  answers: ["A Dogecoin spin-off", "A cross-chain swap token", "A staking reward token", "A stablecoin"],
  correctAnswer: 0,
  explanation: "Baby Doge Coin is a spin-off of Dogecoin created in 2021, featuring automatic redistribution and deflationary tokenomics. It was designed to be faster and more community-driven than its 'father' Dogecoin.",
  difficulty: 'Medium',
  category: 'Meme'
},

{
  question: `What meme coin uses the slogan "Do Only Good Everyday"?`,
  answers: ["Shiba Inu", "Dogecoin", "SafeMoon", "Floki Inu"],
  correctAnswer: 1,
  explanation: "Dogecoin uses the slogan 'Do Only Good Everyday' (DOGE), emphasizing the community's focus on charitable giving, tipping, and positive actions rather than just price speculation.",
  difficulty: 'Medium',
  category: 'Meme'
},

{
  question: `What blockchain hosts Shiba Inu (SHIB)?`,
  answers: ["Ethereum", "Binance Smart Chain", "Solana", "Avalanche"],
  correctAnswer: 0,
  explanation: "Shiba Inu (SHIB) is hosted on the Ethereum blockchain as an ERC-20 token, allowing it to leverage Ethereum's security and ecosystem while maintaining its own community and use cases.",
  difficulty: 'Medium',
  category: 'Meme'
},

{
  question: `What year was Dogecoin launched?`,
  answers: ["2011", "2012", "2013", "2014"],
  correctAnswer: 2,
  explanation: "Dogecoin was launched in December 2013 by software engineers Billy Markus and Jackson Palmer, who created it as a 'joke currency' based on the popular Shiba Inu 'Doge' meme.",
  difficulty: 'Hard',
  category: 'Meme'
},

{
  question: `What is Kishu Inu?`,
  answers: ["A decentralized lending protocol", "A meme coin inspired by Dogecoin and Shiba Inu", "A blockchain explorer", "A stablecoin"],
  correctAnswer: 1,
  explanation: "Kishu Inu is a meme coin inspired by Dogecoin and Shiba Inu, launched in April 2021 with a focus on community growth and passive rewards through its tokenomics that redistribute a percentage of each transaction to holders.",
  difficulty: 'Hard',
  category: 'Meme'
},

{
  question: `What meme coin achieved a market cap of $40 billion during its peak?`,
  answers: ["Dogecoin", "Shiba Inu", "Floki Inu", "SafeMoon"],
  correctAnswer: 1,
  explanation: "Shiba Inu (SHIB) reached a peak market capitalization of approximately $40 billion in October 2021, making it temporarily one of the top 10 cryptocurrencies by market cap.",
  difficulty: 'Hard',
  category: 'Meme'
},

{
  question: `What is the ticker symbol for Samoyedcoin, a Solana-based meme coin?`,
  answers: ["DOGE", "SAMO", "FLKI", "SHIB"],
  correctAnswer: 1,
  explanation: "SAMO is the ticker symbol for Samoyedcoin, a Solana-based meme coin named after the Samoyed dog breed that aims to be the ambassador meme coin for the Solana ecosystem, similar to DOGE for Bitcoin and SHIB for Ethereum.",
  difficulty: 'Hard',
  category: 'Meme'
},

{
  question: `What platform listed Dogecoin for trading in 2021, boosting its price?`,
  answers: ["Binance", "Coinbase", "Kraken", "Robinhood"],
  correctAnswer: 1,
  explanation: "Coinbase listed Dogecoin for trading in June 2021, which significantly boosted its price due to increased accessibility to millions of retail investors on one of the most popular cryptocurrency exchanges.",
  difficulty: 'Hard',
  category: 'Meme'
},


{
  question: `What blockchain hosts most NFTs?`,
  answers: ["Ethereum", "Bitcoin", "Binance Smart Chain", "Solana"],
  correctAnswer: 0,
  explanation: "Ethereum hosts the majority of NFTs through its ERC-721 and ERC-1155 token standards, establishing itself as the dominant blockchain for digital collectibles despite high gas fees and scalability challenges.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What makes an NFT unique?`,
  answers: ["Its price", "Its metadata and non-fungibility", "Its blockchain size", "Its trading volume"],
  correctAnswer: 1,
  explanation: "NFTs are unique due to their metadata and non-fungibility, meaning each token has distinct properties and cannot be replaced with an identical one, unlike cryptocurrencies where each unit is interchangeable.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What was the first NFT project?`,
  answers: ["CryptoKitties", "CryptoPunks", "Bored Ape Yacht Club", "Axie Infinity"],
  correctAnswer: 1,
  explanation: "CryptoPunks, launched by Larva Labs in June 2017, is widely considered the first NFT project on Ethereum. The collection of 10,000 uniquely generated characters helped establish the modern NFT standard.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What standard are most NFTs created with?`,
  answers: ["ERC-20", "ERC-721", "ERC-1155", "BEP-721"],
  correctAnswer: 1,
  explanation: "ERC-721 is the standard most NFTs are created with on Ethereum, defining the minimum interface required for exchanging and transferring non-fungible tokens, including ownership information and metadata.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What is the primary use of NFTs?`,
  answers: ["Staking rewards", "Representing ownership of unique assets", "Enabling fast cryptocurrency transactions", "Minting stablecoins"],
  correctAnswer: 1,
  explanation: "The primary use of NFTs is representing ownership of unique assets, whether digital art, collectibles, virtual real estate, event tickets, or other one-of-a-kind items on the blockchain with provable scarcity.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `What is OpenSea?`,
  answers: ["A DeFi protocol", "An NFT marketplace", "A stablecoin", "A blockchain explorer"],
  correctAnswer: 1,
  explanation: "OpenSea is the largest NFT marketplace where users can buy, sell, and create NFTs across multiple blockchains, including Ethereum, Polygon, and Solana, with millions of collections and assets.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `What does "minting" an NFT mean?`,
  answers: ["Staking the NFT", "Destroying the NFT", "Creating the NFT on a blockchain", "Converting the NFT into a token"],
  correctAnswer: 2,
  explanation: "Minting an NFT means creating a new token on the blockchain by writing data into a smart contract that defines the token's properties, ownership, and transaction history, essentially bringing the NFT into existence.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `Which NFT collection became popular for its cartoon-style apes?`,
  answers: ["CryptoPunks", "Bored Ape Yacht Club", "Axie Infinity", "Meebits"],
  correctAnswer: 1,
  explanation: "Bored Ape Yacht Club became popular for its cartoon-style apes, offering unique benefits including commercial rights, exclusive community access, and additional NFT claims that helped drive its popularity among celebrities.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `What blockchain introduced low-cost NFTs with faster transactions?`,
  answers: ["Ethereum", "Solana", "Bitcoin", "Avalanche"],
  correctAnswer: 1,
  explanation: "Solana introduced low-cost NFTs with faster transactions due to its high-throughput blockchain architecture, offering an alternative to Ethereum with significantly lower gas fees and quicker confirmation times.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `What is ERC-1155, and how does it differ from ERC-721?`,
  answers: ["A token standard for creating NFTs with batch transfer capabilities", "A token standard for staking", "A consensus mechanism for NFTs", "A standard for creating DeFi protocols"],
  correctAnswer: 0,
  explanation: "ERC-1155 is a multi-token standard that allows for batch transfers of multiple token types in a single transaction, making it more gas-efficient than ERC-721, which requires separate transactions for each NFT transfer.",
  difficulty: 'Hard',
  category: 'NFTs'
},
{
  question: `Which NFT sold for $69 million in 2021?`,
  answers: ["CryptoPunk #3100", "Everydays: The First 5000 Days by Beeple", "Bored Ape #1010", "The Sandbox Land Parcel"],
  correctAnswer: 1,
  explanation: "Beeple's 'Everydays: The First 5000 Days' NFT sold for $69 million at Christie's auction in March 2021, making it one of the most expensive digital artworks ever sold and bringing mainstream attention to NFTs.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What is a "lazy mint" in NFT creation?`,
  answers: ["Minting NFTs without paying gas fees upfront", "Creating multiple NFTs simultaneously", "Transferring NFTs to a different wallet", "Burning old NFTs to mint new ones"],
  correctAnswer: 0,
  explanation: "Lazy minting is a process where NFT metadata is stored off-chain until the moment of sale, allowing creators to list NFTs without paying upfront gas fees since the actual minting occurs when a buyer purchases the item.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What is a DAO in the context of NFTs?`,
  answers: ["A Decentralized Autonomous Organization managing NFT decisions", "A type of NFT wallet", "A token exchange mechanism", "A network congestion algorithm"],
  correctAnswer: 0,
  explanation: "In the NFT context, a DAO (Decentralized Autonomous Organization) is a community-governed entity that collectively makes decisions about NFT projects, collections, or platforms through voting mechanisms using governance tokens.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What is a "gas war" in the NFT space?`,
  answers: ["A competition among miners to process transactions", "A situation where users bid higher gas fees to secure NFT transactions", "A system failure in blockchain protocols", "A trading strategy for NFT auctions"],
  correctAnswer: 1,
  explanation: "A gas war occurs when multiple users compete to have their transactions processed first during popular NFT mints, bidding up gas prices and causing network congestion as they try to secure rare or valuable NFTs.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What is the name of the NFT collection featuring rocks that sold for millions of dollars?`,
  answers: ["EtherRocks", "Digital Stones", "RockPunks", "CryptoMinerals"],
  correctAnswer: 0,
  explanation: "EtherRocks is the NFT collection featuring simple JPEG images of rocks that sold for millions of dollars, with some selling for over $1 million each despite their extremely simple design.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What does it mean to "flip" an NFT?`,
  answers: ["To resell it for a profit", "To convert it to cryptocurrency", "To destroy the NFT", "To store it in a vault"],
  correctAnswer: 0,
  explanation: "Flipping an NFT refers to buying an NFT and quickly reselling it for a profit, similar to flipping real estate, often during periods of high demand or when acquiring NFTs from promising new collections.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What is the purpose of royalties in NFTs?`,
  answers: ["To pay miners for validating transactions", "To provide ongoing earnings to the original creator from resale", "To fund blockchain development", "To maintain the NFT's metadata"],
  correctAnswer: 1,
  explanation: "Royalties in NFTs provide ongoing earnings to original creators from secondary sales, typically 5-10% of the resale price, automatically enforced by smart contracts to ensure creators benefit from their work's appreciation.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `Which NFT game popularized "play-to-earn" mechanics?`,
  answers: ["CryptoKitties", "Axie Infinity", "Decentraland", "The Sandbox"],
  correctAnswer: 1,
  explanation: "Axie Infinity popularized the play-to-earn model where players earn cryptocurrency by playing the game, breeding digital creatures called Axies, and participating in battles, particularly gaining traction in developing economies.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What blockchain introduced the first NFTs?`,
  answers: ["Bitcoin", "Ethereum", "Counterparty (XCP)", "Solana"],
  correctAnswer: 2,
  explanation: "Counterparty (XCP), built on the Bitcoin blockchain, introduced the first NFTs with projects like Rare Pepes in 2016, predating Ethereum's ERC-721 standard that later popularized NFTs.",
  difficulty: 'Easy',
  category: 'NFTs'
},

{
  question: `What is the primary function of Rarible?`,
  answers: ["An NFT marketplace for creators and collectors", "A crypto exchange for meme coins", "A DeFi lending protocol", "A layer-2 blockchain for NFTs"],
  correctAnswer: 0,
  explanation: "Rarible is primarily an NFT marketplace that allows creators and collectors to mint, buy, and sell NFTs, with a focus on community governance through its RARI token that lets users participate in platform decisions.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `What does "generative art" refer to in NFTs?`,
  answers: ["Art created algorithmically by code", "Art based on traditional techniques", "NFTs with interactive features", "Digital art stored directly on the blockchain"],
  correctAnswer: 0,
  explanation: "Generative art in NFTs refers to artwork created algorithmically by code, where each piece is uniquely generated based on randomized variables, creating collections with shared themes but individual variations.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `What was the first video game to integrate NFTs?`,
  answers: ["CryptoKitties", "Spells of Genesis", "Decentraland", "The Sandbox"],
  correctAnswer: 1,
  explanation: "Spells of Genesis, launched in 2017, was the first video game to integrate blockchain-based collectible cards as NFTs, originally on the Bitcoin-based Counterparty protocol before other games popularized the concept.",
  difficulty: 'Medium',
  category: 'NFTs'
},

{
  question: `What protocol underpins many NFT marketplaces like OpenSea?`,
  answers: ["Wyvern Protocol", "Lightning Protocol", "ERC-777 Protocol", "Plasma Protocol"],
  correctAnswer: 0,
  explanation: "The Wyvern Protocol underpins marketplaces like OpenSea, providing the infrastructure for secure trading of assets with specific attributes, allowing for complex exchange mechanisms beyond simple transfers.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What does "IPFS" stand for in NFT storage?`,
  answers: ["InterPlanetary File System", "Immutable Protocol File Storage", "Integrated Protocol for Security", "Independent Peer File Sharing"],
  correctAnswer: 0,
  explanation: "IPFS stands for InterPlanetary File System, a decentralized storage network often used to store NFT metadata and assets to ensure persistence and reduce reliance on centralized servers.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What is "fractionalized ownership" of NFTs?`,
  answers: ["Dividing an NFT into smaller parts to allow shared ownership", "Storing the NFT metadata across multiple chains", "Allowing one NFT to represent multiple assets", "Burning a fraction of an NFT's value"],
  correctAnswer: 0,
  explanation: "Fractionalized ownership divides NFTs into smaller fungible tokens, allowing multiple people to own shares of valuable NFTs, increasing liquidity and enabling broader participation in high-value digital assets.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What is the term for NFTs that grant governance rights in a project?`,
  answers: ["Utility NFTs", "Governance NFTs", "DAO Membership Tokens", "Ownership Tokens"],
  correctAnswer: 1,
  explanation: "Governance NFTs grant holders the right to participate in a project's decision-making process, often with voting power proportional to the NFT's rarity or attributes, merging collectability with utility.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What does a "blue chip" NFT mean?`,
  answers: ["An NFT considered a long-term, valuable investment", "An NFT representing stock shares", "An NFT created by a gaming company", "An NFT with utility for DeFi platforms"],
  correctAnswer: 0,
  explanation: "A blue chip NFT refers to assets from well-established collections with strong market history, brand recognition, and sustained value, considered relatively safe long-term investments in the volatile NFT space.",
  difficulty: 'Hard',
  category: 'NFTs'
},

{
  question: `What is the main benefit of layer-2 solutions like Polygon?`,
  answers: ["Lower transaction fees and faster processing", "Improved wallet security", "Enhanced privacy for smart contracts", "Increased decentralization"],
  correctAnswer: 0,
  explanation: "Layer-2 solutions like Polygon offer lower transaction fees and faster processing by handling transactions off the main blockchain and periodically settling batches of transactions on the main chain, improving scalability.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `What does "state channel" mean in blockchain?`,
  answers: ["A private channel for faster transactions off-chain", "A method for increasing blockchain consensus", "A system for verifying staking pools", "A specific data storage mechanism"],
  correctAnswer: 0,
  explanation: "A state channel is a two-way communication channel between participants allowing them to conduct multiple transactions off-chain, only settling the final state on the blockchain, reducing fees and increasing throughput.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which blockchain introduced Delegated Proof of Stake (DPoS)?`,
  answers: ["EOS", "Ethereum", "Bitcoin", "Cardano"],
  correctAnswer: 0,
  explanation: "EOS introduced Delegated Proof of Stake, where token holders vote for a limited number of delegates (block producers) who validate transactions, offering higher throughput than traditional PoS while maintaining decentralization.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `What does "double-spending" mean in blockchain?`,
  answers: ["Spending the same cryptocurrency more than once", "Sending multiple transactions to the same address", "Using two wallets for mining rewards", "Splitting a blockchain during a hard fork"],
  correctAnswer: 0,
  explanation: "Double-spending is the risk of spending the same cryptocurrency more than once by manipulating the transaction system, which blockchain technology specifically prevents through its consensus mechanisms and immutable ledger.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What is the role of a zero-knowledge proof in blockchain?`,
  answers: ["To verify information without revealing the data itself", "To enhance staking rewards", "To ensure faster transactions", "To calculate mining difficulty"],
  correctAnswer: 0,
  explanation: "Zero-knowledge proofs verify information without revealing the data itself, enhancing privacy by proving a statement is true without sharing the underlying information, crucial for privacy-focused blockchains like Zcash.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `Which cryptocurrency is often referred to as "digital gold"?`,
  answers: ["Ethereum", "Bitcoin", "Litecoin", "Dogecoin"],
  correctAnswer: 1,
  explanation: "Bitcoin is often referred to as 'digital gold' due to its store of value properties, limited supply cap of 21 million coins, and function as a hedge against inflation, similar to how gold is traditionally viewed.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `Which blockchain is known for enabling smart contracts and decentralized applications (dApps)?`,
  answers: ["Bitcoin", "Ethereum", "Ripple", "Cardano"],
  correctAnswer: 1,
  explanation: "Ethereum is known for enabling smart contracts and decentralized applications (dApps) through its programmable blockchain, allowing developers to build complex applications beyond simple transactions.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What is the term for the process of validating transactions in a proof-of-work system?`,
  answers: ["Mining", "Staking", "Delegating", "Farming"],
  correctAnswer: 0,
  explanation: "Mining is the process of validating transactions in a proof-of-work system by solving complex mathematical puzzles, with successful miners adding blocks to the blockchain and receiving rewards in return.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What is the first-ever cryptocurrency ever created?`,
  answers: ["Dogecoin", "Litecoin", "Bitcoin", "Ethereum"],
  correctAnswer: 2,
  explanation: "Bitcoin was the first-ever cryptocurrency created, launched by Satoshi Nakamoto in 2009 following the publication of the Bitcoin whitepaper that outlined its revolutionary peer-to-peer electronic cash system.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What is the primary purpose of the Ethereum blockchain?`,
  answers: ["To serve as a store of value", "To facilitate smart contracts and decentralized applications", "To provide a privacy-focused currency", "To process large-scale transactions"],
  correctAnswer: 1,
  explanation: "The primary purpose of Ethereum is to facilitate smart contracts and decentralized applications, creating a world computer that can execute programmable agreements without intermediaries.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which protocol is used by the Ethereum blockchain to secure its transactions?`,
  answers: ["Proof of Stake", "Proof of Work", "Proof of Authority", "Proof of Space"],
  correctAnswer: 1,
  explanation: "Proof of Work was originally used by Ethereum to secure its transactions, though the network began transitioning to Proof of Stake in 2022 with 'The Merge' to improve energy efficiency and scalability.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which of the following is a privacy-focused cryptocurrency?`,
  answers: ["Ripple", "Monero", "Litecoin", "Ethereum"],
  correctAnswer: 1,
  explanation: "Monero is a privacy-focused cryptocurrency that uses ring signatures, stealth addresses, and RingCT to obscure transaction details, making it one of the leading coins for those seeking financial privacy.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `What is a "hard fork" in blockchain technology?`,
  answers: ["A temporary breakdown in a blockchain's operation", "A change in the blockchain's consensus protocol that creates a new version of the blockchain", "A rapid mining process to speed up transaction confirmation", "A decrease in a cryptocurrency's block reward"],
  correctAnswer: 1,
  explanation: "A hard fork is a significant protocol change that creates incompatibility between old and new versions, effectively splitting the blockchain into two separate paths. This happens when the community cannot reach consensus on major updates.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which company launched the first Bitcoin exchange-traded fund (ETF)?`,
  answers: ["Grayscale", "Fidelity", "VanEck", "ProShares"],
  correctAnswer: 3,
  explanation: "ProShares launched the first Bitcoin futures ETF (BITO) in October 2021, allowing investors to gain exposure to Bitcoin through regulated exchanges without directly owning the cryptocurrency, marking a significant milestone for mainstream adoption.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `What was the name of the Ethereum upgrade that was used to transition from Proof of Work to Proof of Stake?`,
  answers: ["Casper", "Serenity", "Constantinople", "London"],
  correctAnswer: 0,
  explanation: "Casper was the name of Ethereum's upgrade for transitioning from Proof of Work to Proof of Stake, significantly reducing energy consumption and allowing token holders to validate transactions and earn rewards by staking ETH.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `Which of the following DeFi protocols allows users to borrow and lend cryptocurrencies?`,
  answers: ["Uniswap", "Aave", "PancakeSwap", "Synthetix"],
  correctAnswer: 1,
  explanation: "Aave is a DeFi lending protocol that allows users to deposit cryptocurrencies to earn interest or borrow assets against their collateral, with features like flash loans and variable/stable interest rates for different risk preferences.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What does the acronym "DAO" stand for in the cryptocurrency space?`,
  answers: ["Decentralized Autonomous Organization", "Distributed Application Operator", "Digital Asset Operator", "Decentralized Accounting Office"],
  correctAnswer: 0,
  explanation: "DAO stands for Decentralized Autonomous Organization, which is an entity governed by smart contracts and token holders who vote on decisions, allowing for community management without centralized leadership or intermediaries.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `Which Ethereum-based token standard is widely used for creating decentralized applications and tokens?`,
  answers: ["ERC-20", "ERC-721", "ERC-1155", "ERC-777"],
  correctAnswer: 0,
  explanation: "ERC-20 is the most widely used Ethereum token standard for creating fungible tokens and decentralized applications, defining a common set of rules and functions that allow tokens to interact seamlessly with wallets and exchanges.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What does the term "HODL" mean in the cryptocurrency world?`,
  answers: ["Sell", "Hold on for dear life", "Trade quickly", "Buy more coins"],
  correctAnswer: 1,
  explanation: "HODL originates from a misspelled forum post and means 'Hold On for Dear Life,' encouraging investors to keep their cryptocurrencies despite market volatility rather than selling during price dips or fluctuations.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `Which of the following is a stablecoin?`,
  answers: ["Bitcoin", "USDT (Tether)", "Ethereum", "Dogecoin"],
  correctAnswer: 1,
  explanation: "USDT (Tether) is a stablecoin designed to maintain a consistent value by being pegged to the US dollar in a 1:1 ratio, providing stability in the volatile cryptocurrency market and facilitating trading and transfers.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What does "FOMO" stand for in the crypto space?`,
  answers: ["Fear of Missing Out", "Fear of Making Options", "Fast Offer Market Operations", "Factor of Money Optimization"],
  correctAnswer: 0,
  explanation: "FOMO stands for 'Fear of Missing Out,' describing the anxiety investors feel when seeing others profit from crypto price increases, often leading to emotional buying decisions at market peaks rather than rational investment choices.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `Which of these is a popular cryptocurrency wallet?`,
  answers: ["Coinbase", "MetaMask", "Ripple", "Polkadot"],
  correctAnswer: 1,
  explanation: "MetaMask is a popular cryptocurrency wallet that functions as a browser extension and mobile app, allowing users to store Ethereum and ERC-20 tokens, interact with decentralized applications, and manage their digital assets.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What is the blockchain that Ripple uses for transactions called?`,
  answers: ["XRP Ledger", "Bitcoin Blockchain", "Ethereum Network", "Polkadot"],
  correctAnswer: 0,
  explanation: "XRP Ledger is the blockchain used by Ripple for transactions, designed for fast, low-cost international payments and settlement, using a unique consensus algorithm different from traditional Proof of Work or Proof of Stake systems.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What is the primary function of a smart contract?`,
  answers: ["To secure the network from attacks", "To execute predefined agreements automatically", "To provide privacy for transactions", "To validate transactions"],
  correctAnswer: 1,
  explanation: "Smart contracts automatically execute predefined agreements when specific conditions are met, eliminating intermediaries and enabling trustless transactions on blockchains like Ethereum, with code that enforces the terms.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which decentralized exchange (DEX) runs on the Ethereum blockchain?`,
  answers: ["PancakeSwap", "Uniswap", "SushiSwap", "Balancer"],
  correctAnswer: 1,
  explanation: "Uniswap is a decentralized exchange that runs natively on the Ethereum blockchain, using an automated market maker (AMM) model with liquidity pools rather than traditional order books to facilitate token swaps.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `What is the term used for a cryptocurrency that represents a physical asset?`,
  answers: ["Altcoin", "Security Token", "Stablecoin", "Non-Fungible Token (NFT)"],
  correctAnswer: 1,
  explanation: "Security Tokens represent ownership of physical assets like real estate, stocks, or commodities on the blockchain, providing fractional ownership, 24/7 trading, and automated compliance through smart contracts.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which is the consensus mechanism used by the Bitcoin network?`,
  answers: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of History"],
  correctAnswer: 1,
  explanation: "Proof of Work is Bitcoin's consensus mechanism, where miners compete to solve complex mathematical puzzles, with the winner earning the right to add the next block to the blockchain and receive newly minted bitcoins as rewards.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `What is the name of the Ethereum upgrade aimed at improving scalability and reducing transaction fees?`,
  answers: ["Istanbul", "Berlin", "London", "EIP-1559"],
  correctAnswer: 3,
  explanation: "EIP-1559 was a major Ethereum upgrade implemented in August 2021 that changed the fee market structure, introducing a base fee that gets burned and reducing transaction fee volatility while improving user experience.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `Which of these cryptocurrencies is based on the Delegated Proof of Stake (DPoS) consensus mechanism?`,
  answers: ["EOS", "Ethereum", "Bitcoin", "Litecoin"],
  correctAnswer: 0,
  explanation: "EOS uses Delegated Proof of Stake (DPoS) where token holders vote for 21 block producers who validate transactions, offering higher throughput and lower latency than traditional PoW systems while maintaining community governance.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What is the term for the practice of locking up cryptocurrency in a wallet to earn rewards?`,
  answers: ["Staking", "Mining", "Farming", "Yield Farming"],
  correctAnswer: 0,
  explanation: "Staking is the practice of locking up cryptocurrency in a wallet to support network operations and validate transactions in Proof of Stake blockchains, earning rewards proportional to the amount staked.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What was the first decentralized finance (DeFi) platform to allow users to lend and borrow cryptocurrencies?`,
  answers: ["MakerDAO", "Compound", "Aave", "Uniswap"],
  correctAnswer: 1,
  explanation: "Compound was the first DeFi lending platform to gain significant traction, allowing users to lend and borrow cryptocurrencies with algorithmically determined interest rates based on supply and demand for each asset.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `Which blockchain project uses the "Sharding" technique to increase scalability?`,
  answers: ["Ethereum 2.0", "Cardano", "Polkadot", "Zilliqa"],
  correctAnswer: 3,
  explanation: "Zilliqa was the first public blockchain to implement sharding, dividing the network into smaller groups of nodes to process transactions in parallel, significantly improving throughput as the network grows.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `Which of the following is the native currency of the Ethereum network?`,
  answers: ["Ether", "Bitcoin", "Litecoin", "Ripple"],
  correctAnswer: 0,
  explanation: "Ether (ETH) is the native currency of the Ethereum network, used to pay for transaction fees (gas), deploy smart contracts, and serve as a store of value within the Ethereum ecosystem.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `Which blockchain is known for its lightning-fast transaction processing?`,
  answers: ["Bitcoin", "Polkadot", "Solana", "Ethereum"],
  correctAnswer: 2,
  explanation: "Solana is known for its lightning-fast transaction processing, capable of handling up to 65,000 transactions per second with sub-second finality and minimal fees due to its unique Proof of History consensus mechanism.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `Which term refers to the act of converting cryptocurrency into traditional fiat money?`,
  answers: ["Staking", "Mining", "Cashing out", "HODLing"],
  correctAnswer: 2,
  explanation: "Cashing out refers to converting cryptocurrency back into traditional fiat currency like USD or EUR, typically through exchanges or peer-to-peer platforms when investors want to realize profits or access funds.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What does the term "HODL" mean in cryptocurrency?`,
  answers: ["Hold On for Dear Life", "High Order Digital Ledger", "Hold Over Daily Limit", "Hyper-Optimized Digital Lock"],
  correctAnswer: 0,
  explanation: "HODL stands for 'Hold On for Dear Life,' a crypto community term that originated from a misspelled forum post in 2013, encouraging investors to hold their assets through market volatility instead of panic selling.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `Which of these is NOT a feature of Bitcoin?`,
  answers: ["Decentralization", "Immutable ledger", "High transaction fees", "Privacy by default"],
  correctAnswer: 3,
  explanation: "Privacy by default is not a feature of Bitcoin. While Bitcoin offers pseudonymity through addresses, all transactions are publicly visible on the blockchain, unlike privacy-focused cryptocurrencies like Monero or Zcash.",
  difficulty: 'Easy',
  category: 'Technical'
},

{
  question: `What is the function of a "block explorer" in blockchain technology?`,
  answers: ["To mine new blocks", "To check the price of cryptocurrencies", "To view and search blockchain transactions", "To store cryptocurrency wallets"],
  correctAnswer: 2,
  explanation: "Block explorers allow users to view and search blockchain transactions, addresses, and blocks in a user-friendly interface, providing transparency by letting anyone verify transactions and track wallet activities.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which DeFi project is best known for enabling users to swap assets without the need for a centralized exchange?`,
  answers: ["Uniswap", "Aave", "Compound", "MakerDAO"],
  correctAnswer: 0,
  explanation: "Uniswap is best known for enabling users to swap assets without centralized exchanges, using automated market maker (AMM) technology and liquidity pools to determine prices and execute trades directly on the blockchain.",
  difficulty: 'Medium',
  category: 'Technical'
},
{
  question: `Which is the main advantage of using a "hardware wallet" over a "software wallet"?`,
  answers: ["Faster transactions", "Lower transaction fees", "Enhanced security against hacks", "Easier access"],
  correctAnswer: 2,
  explanation: "Hardware wallets provide enhanced security against hacks by storing private keys offline in physical devices, keeping them isolated from internet-connected computers and protecting funds even if your computer is compromised by malware.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `Which project was created to improve Bitcoin's scalability and enable faster transactions?`,
  answers: ["SegWit", "Chainlink", "Polkadot", "Litecoin"],
  correctAnswer: 0,
  explanation: "SegWit (Segregated Witness) was implemented in 2017 to improve Bitcoin's scalability by separating signature data from transaction data, increasing block capacity and enabling faster transactions with lower fees.",
  difficulty: 'Medium',
  category: 'Technical'
},

{
  question: `What is the primary goal of the Polkadot blockchain?`,
  answers: ["To improve Ethereum scalability", "To provide decentralized storage solutions", "To allow different blockchains to interoperate", "To create a privacy-centric network"],
  correctAnswer: 2,
  explanation: "Polkadot's primary goal is to allow different blockchains to interoperate through its multi-chain framework, enabling cross-chain transfers of any data or asset type through a network of specialized 'parachains' connected to a central 'relay chain'.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What does the "Halving" event refer to in Bitcoin?`,
  answers: ["A reduction in transaction fees", "A reduction in mining rewards", "A reduction in the maximum supply of Bitcoin", "A split in the Bitcoin blockchain"],
  correctAnswer: 1,
  explanation: "The Halving event refers to a programmed reduction in Bitcoin mining rewards that occurs approximately every four years (210,000 blocks), cutting them in half as part of Bitcoin's disinflationary design to maintain scarcity.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `Which protocol allows users to create synthetic assets on Ethereum?`,
  answers: ["Compound", "Synthetix", "MakerDAO", "Uniswap"],
  correctAnswer: 1,
  explanation: "Synthetix allows users to create synthetic assets (Synths) on Ethereum that track the value of real-world assets like stocks, commodities, and currencies by staking the SNX token as collateral to maintain the system.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What is a "validator" in the context of a Proof-of-Stake (PoS) blockchain?`,
  answers: ["A miner that verifies and adds transactions to the blockchain", "A node that confirms the authenticity of transactions and adds blocks", "A central authority that approves new blocks", "A user who stakes tokens for governance votes"],
  correctAnswer: 1,
  explanation: "In Proof-of-Stake blockchains, a validator is a node that confirms transaction authenticity and adds blocks to the chain, selected based on the amount of cryptocurrency they've staked, replacing the energy-intensive mining process of PoW systems.",
  difficulty: 'Hard',
  category: 'Technical'
},

{
  question: `What is "sharding" in blockchain technology?`,
  answers: ["Dividing a blockchain into smaller networks to increase scalability", "Using multiple consensus mechanisms in one network", "Encrypting all data on the blockchain for security", "A method of increasing transaction fees for miners"],
  correctAnswer: 0,
  explanation: "Sharding is a scalability solution that divides a blockchain into smaller, manageable partitions called shards, each processing transactions in parallel, significantly increasing throughput as the network grows without sacrificing security or decentralization.",
  difficulty: 'Hard',
  category: 'Technical'
}
  
];

const QUESTIONS_PER_GAME = {
  Easy: 5,
  Medium: 8,
  Hard: 10
} as const;

const difficultySettings = {
  Easy: {
    timeLimit: 60,
    lives: 3,
    multiplier: 1,
    tokenBase: 10
  },
  Medium: {
    timeLimit: 45,
    lives: 2,
    multiplier: 2,
    tokenBase: 20
  },
  Hard: {
    timeLimit: 30,
    lives: 1,
    multiplier: 3,
    tokenBase: 30
  }
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomQuestions(difficulty: 'Easy' | 'Medium' | 'Hard'): Question[] {
  const difficultyQuestions = QUESTION_BANK.filter(q => {
    switch (difficulty) {
      case 'Easy':
        return q.difficulty === 'Easy';
      case 'Medium':
        return q.difficulty === 'Easy' || q.difficulty === 'Medium';
      case 'Hard':
        return true;
    }
  });

  const requiredQuestions = QUESTIONS_PER_GAME[difficulty];
  if (difficultyQuestions.length < requiredQuestions) {
    console.warn(`Not enough questions for ${difficulty} difficulty. Using all available questions.`);
    return shuffleArray(difficultyQuestions);
  }

  if (difficulty === 'Medium' || difficulty === 'Hard') {
    const categories = [...new Set(difficultyQuestions.map(q => q.category))];
    const selectedQuestions: Question[] = [];

    categories.forEach(category => {
      const categoryQuestions = difficultyQuestions.filter(q => q.category === category);
      if (categoryQuestions.length > 0) {
        selectedQuestions.push(shuffleArray(categoryQuestions)[0]);
      }
    });

    const remainingSlots = requiredQuestions - selectedQuestions.length;
    if (remainingSlots > 0) {
      const remainingQuestions = difficultyQuestions.filter(
        q => !selectedQuestions.includes(q)
      );
      selectedQuestions.push(...shuffleArray(remainingQuestions).slice(0, remainingSlots));
    }

    return shuffleArray(selectedQuestions);
  }

  return shuffleArray(difficultyQuestions).slice(0, requiredQuestions);
}

export const CryptoTrivia: React.FC<CryptoTriviaProps> = ({ gameType = 'TRIVIA' }) => {


  const { userData } = useContext(Web3AuthContext);

  const gameSessionSaved = useRef(false);

  const [gameData, setGameData] = useState<any[]>([]);
  const [gameId, setGameId] = useState<string>("");



  const { gameStats, updateGameStats } = useStore();
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  const [state, setState] = useState<GameState>({
    screen: 'menu',
    difficulty: 'Medium',
    currentQuestion: 0,
    score: 0,
    timeLeft: 0,
    answers: [],
    highScore: 0,
    bestStreak: 0,
    totalTokens: 0,
    selectedAnswer: null,
    showFeedback: false,
    lives: 3,
    powerups: {
      fiftyFifty: true,
      timeFreeze: true,
      doublePoints: true
    },
    streak: 0,
    multiplier: 1
  });
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const loadGameData = async () => {
      if (userData && userData.accessToken) {
        try {
          const data = await GameService.fetchUserGameId(userData.accessToken);
          
          if (Array.isArray(data)) {
            setGameData(data);
            
            const game = data.find(g => g.type === gameType);
            if (game) {
              console.log(`Found game with type ${gameType}:`, game);
              setGameId(game.id);
            } else {
              console.warn(`No game found with type ${gameType}`);
            }
          }
        } catch (error) {
          console.error("Error loading game data:", error);
        }
      }
    };
    
    loadGameData();
  }, [userData, gameType]);

  useEffect(() => {
    if (state.screen === 'menu' || state.screen === 'difficulty') {
      gameSessionSaved.current = false;
    }
  }, [state.screen]);

  
  useEffect(() => {
    
    if (state.screen === 'results' && !gameSessionSaved.current && 
        userData && userData.accessToken) {
          
      
      gameSessionSaved.current = true;
      
      const correctAnswers = state.answers.filter(a => a).length;
      const totalQuestions = QUESTIONS_PER_GAME[state.difficulty];
      const percentage = (correctAnswers / totalQuestions) * 100;
      const tokens = Math.round(correctAnswers * difficultySettings[state.difficulty].tokenBase * state.multiplier);
      const winStatus = percentage >=70;
      
      const gameSession: GameSession = {
        gameId: gameId,
        tokensEarned: tokens,
        score: state.score,
        accuracy: percentage,
        streak: state.bestStreak,
        winStatus:winStatus,
      };

      saveGameSession(gameSession);

      if (gameStats) {
        updateGameStats({
          triviaStats: {
            gamesPlayed: gameStats.triviaStats.gamesPlayed + 1,
            tokensEarned: gameStats.triviaStats.tokensEarned + tokens,
            highScore: Math.max(gameStats.triviaStats.highScore, state.score),
            accuracy: (gameStats.triviaStats.accuracy + percentage) / 2,
            bestStreak: Math.max(gameStats.triviaStats.bestStreak, state.bestStreak)
          },
          totalTokens: gameStats.totalTokens + tokens
        });
      }
    }
  }, [state.screen, userData, gameStats, state.answers, state.difficulty, state.multiplier, state.score, state.bestStreak, sessionStartTime]);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (state.screen === 'game') {
      const timer = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.screen]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.screen === 'game') {
      handleTimeUp();
    }
  }, [state.timeLeft]);

  const startGame = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const randomizedQuestions = getRandomQuestions(difficulty);
    setGameQuestions(randomizedQuestions);
    setSessionStartTime(new Date());
    setState(prev => ({
      ...prev,
      screen: 'game',
      difficulty,
      currentQuestion: 0,
      score: 0,
      timeLeft: difficultySettings[difficulty].timeLimit,
      answers: [],
      lives: difficultySettings[difficulty].lives,
      powerups: {
        fiftyFifty: true,
        timeFreeze: true,
        doublePoints: true
      },
      streak: 0,
      multiplier: difficultySettings[difficulty].multiplier
    }));
  };

  const handleTimeUp = () => {
    if (state.lives > 1) {
      setState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        timeLeft: difficultySettings[prev.difficulty].timeLimit,
        streak: 0,
        multiplier: difficultySettings[prev.difficulty].multiplier
      }));
    } else {
      endGame();
    }
  };

const endGame = () => {
    const baseScore = state.answers.filter(a => a).length;
    const difficultyMultiplier = difficultySettings[state.difficulty].multiplier;
    const finalScore = Math.round(baseScore * difficultyMultiplier * state.multiplier);
    const tokensEarned = finalScore * difficultySettings[state.difficulty].tokenBase;
    const accuracy = state.answers.length > 0
      ? (state.answers.filter(a => a).length / state.answers.length) * 100
      : 0;

    setState(prev => ({
      ...prev,
      screen: 'results',
      score: finalScore,
      highScore: Math.max(prev.highScore, finalScore),
      totalTokens: prev.totalTokens + tokensEarned
    }));


  };

  const handleAnswer = (answerIndex: number) => {
    if (state.showFeedback) return;

    const isCorrect = answerIndex === gameQuestions[state.currentQuestion].correctAnswer;
    const newAnswers = [...state.answers, isCorrect];
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const newMultiplier = Math.min(3, 1 + Math.floor(newStreak / 3) * 0.5);

    setState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true,
      streak: newStreak,
      multiplier: newMultiplier * difficultySettings[prev.difficulty].multiplier
    }));

    setTimeout(() => {
      if (state.currentQuestion === gameQuestions.length - 1 || (!isCorrect && state.lives === 1)) {
        const baseScore = newAnswers.filter(a => a).length;
        const difficultyMultiplier = difficultySettings[state.difficulty].multiplier;
        const finalScore = Math.round(baseScore * difficultyMultiplier * newMultiplier);

        setState(prev => ({
          ...prev,
          answers: newAnswers,
          score: finalScore,
          screen: 'results',
          highScore: Math.max(prev.highScore, finalScore),
          totalTokens: prev.totalTokens + (finalScore * difficultySettings[prev.difficulty].tokenBase)
        }));
      } else if (!isCorrect) {
        setState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          answers: newAnswers,
          selectedAnswer: null,
          showFeedback: false,
          lives: prev.lives - 1,
          timeLeft: difficultySettings[prev.difficulty].timeLimit
        }));
      } else {
        setState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          answers: newAnswers,
          selectedAnswer: null,
          showFeedback: false,
          timeLeft: difficultySettings[prev.difficulty].timeLimit
        }));
      }
    }, 2000);
  };

  const usePowerup = (type: keyof GameState['powerups']) => {
    if (!state.powerups[type]) return;

    setState(prev => ({
      ...prev,
      powerups: {
        ...prev.powerups,
        [type]: false
      }
    }));

    switch (type) {
      case 'fiftyFifty':
        break;
      case 'timeFreeze':
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft + 15
        }));
        break;
      case 'doublePoints':
        setState(prev => ({
          ...prev,
          multiplier: prev.multiplier * 2
        }));
        break;
    }
  };
  const saveGameSession = async (gameSession: GameSession) => {
    try{
      if(gameSession && userData&& userData.accessToken){
        const response =  await GameService.gameHistory(userData.accessToken, gameSession);
        console.log(response)
      }
    } catch (error) {
      console.error('Error saving game session:', error);
    }


  }
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="flex items-center justify-center w-20 h-20 mb-6 sm:w-24 sm:h-24 sm:mb-8 rounded-full bg-blue-500/20">
        <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
      </div>

      <h1 className="mb-3 text-2xl sm:text-4xl font-bold text-center sm:mb-4">Crypto Trivia</h1>
      <p className="max-w-md mb-6 text-sm text-center sm:text-base sm:mb-8 text-white/60">
        Test your cryptocurrency knowledge and earn tokens!
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3 sm:gap-4">
        <button
          onClick={() => setState(prev => ({ ...prev, screen: 'difficulty' }))}
          className="w-full py-2.5 sm:py-3 font-medium transition-colors bg-blue-500 hover:bg-blue-600 rounded-xl"
        >
          Play Now
        </button>

        <div className="text-center">
          <div className="text-xs sm:text-sm text-white/60">Your Tokens</div>
          <div className="text-xl sm:text-2xl font-bold">{state.totalTokens}</div>
        </div>

        <div className="text-center">
          <div className="text-xs sm:text-sm text-white/60">Best Streak</div>
          <div className="text-lg sm:text-xl font-bold text-yellow-400">{state.bestStreak} 🔥</div>
        </div>

        <div className="text-xs sm:text-sm text-center text-white/60">
          Questions per game:
          <div className="flex justify-between mt-1 text-white/80">
            <span>Easy: {QUESTIONS_PER_GAME.Easy}</span>
            <span>Medium: {QUESTIONS_PER_GAME.Medium}</span>
            <span>Hard: {QUESTIONS_PER_GAME.Hard}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDifficultySelect = () => (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="mb-6 text-xl sm:text-3xl font-bold sm:mb-12">Select Difficulty</h2>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4 sm:gap-6 mb-6 sm:mb-12`}>
        {(['Easy', 'Medium', 'Hard'] as const).map((difficulty) => {
          const settings = difficultySettings[difficulty];
          return (
            <button
              key={difficulty}
              onClick={() => startGame(difficulty)}
              className={`p-4 sm:p-6 transition-all bg-white/5 hover:bg-white/10 rounded-xl hover:scale-105 ${isMobile ? 'w-full' : 'w-48'
                }`}
            >
              <h3 className="mb-1 text-lg sm:text-xl font-bold sm:mb-2">{difficulty}</h3>
              <div className="space-y-1 text-xs sm:text-sm text-white/60 sm:space-y-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{settings.timeLimit}s per question</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                  <span>{settings.lives} lives</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                  <span>{settings.tokenBase} tokens per correct</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  <span>{settings.multiplier}x multiplier</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setState(prev => ({ ...prev, screen: 'menu' }))}
        className="py-2 px-4 text-sm sm:text-base transition-colors text-white/60 hover:text-white"
      >
        Back to Menu
      </button>
    </div>
  );

  const renderGame = () => {
    const question = gameQuestions[state.currentQuestion];
    const timeLeftPercentage = (state.timeLeft / difficultySettings[state.difficulty].timeLimit) * 100;

    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className={`fixed top-0 left-0 right-0 w-full backdrop-blur-sm ${isMobile ? 'pt-2 pb-3 px-2' : 'p-4'}`}>
          <div className="flex flex-col max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ArrowLeft
                  className="w-4 h-4 mr-2 text-white/60"
                  onClick={() => setState(prev => ({ ...prev, screen: 'menu' }))}
                />
                <span className="text-xs font-medium">Games</span>
                {!isMobile && (
                  <div className="ml-4 text-yellow-400 text-sm">
                    <span className="font-bold">{state.totalTokens}</span> tokens
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                {[...Array(state.lives)].map((_, i) => (
                  <Heart key={i} className="w-4 h-4 text-red-400" fill="currentColor" />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {state.powerups.fiftyFifty && (
                  <button
                    onClick={() => usePowerup('fiftyFifty')}
                    className="p-1 rounded-lg bg-blue-500 hover:bg-blue-600"
                    title="50/50: Remove two wrong answers"
                  >
                    <div className="text-xs font-bold">50:50</div>
                  </button>
                )}
                {state.powerups.timeFreeze && (
                  <button
                    onClick={() => usePowerup('timeFreeze')}
                    className="p-1 rounded-lg bg-blue-500 hover:bg-blue-600"
                    title="Time Freeze: Add 15 seconds"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                )}
                {state.powerups.doublePoints && (
                  <button
                    onClick={() => usePowerup('doublePoints')}
                    className="p-1 rounded-lg bg-blue-500 hover:bg-blue-600"
                    title="Double Points: 2x multiplier"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Second row with timer */}
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-white/60" />
              <div className="w-full h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full transition-all duration-1000 ${timeLeftPercentage > 66 ? 'bg-green-500' :
                      timeLeftPercentage > 33 ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${timeLeftPercentage}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${timeLeftPercentage > 66 ? 'text-green-400' :
                  timeLeftPercentage > 33 ? 'text-yellow-400' :
                    'text-red-400'
                }`}>{state.timeLeft}s</span>

              {state.streak > 0 && (
                <div className="flex items-center gap-1 text-yellow-400 ml-1">
                  <Zap className="w-4 h-4" fill="currentColor" />
                  <span className="text-sm font-bold">{state.streak}x</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 mt-24 sm:mt-12 sm:mb-8">
          <span className="text-xs sm:text-sm text-white/60">Question</span>
          <span className="text-sm sm:text-base font-bold">{state.currentQuestion + 1}</span>
          <span className="text-xs sm:text-sm text-white/60">of</span>
          <span className="text-sm sm:text-base font-bold">{QUESTIONS_PER_GAME[state.difficulty]}</span>
        </div>

        <div className="max-w-2xl mb-6 text-center sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
              }`}>
              {question.difficulty}
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-blue-400 rounded-full bg-blue-500/20">
              {question.category}
            </span>
          </div>
          <h3 className="mb-2 text-lg sm:text-2xl font-bold">{question.question}</h3>
          {state.showFeedback && (
            <p className="p-3 mt-3 text-sm rounded-lg sm:p-4 sm:mt-4 text-white/60 bg-white/5">{question.explanation}</p>
          )}
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={state.showFeedback}
              className={`p-3 sm:p-4 rounded-xl transition-all ${state.showFeedback
                  ? index === question.correctAnswer
                    ? 'bg-green-500/20 text-green-400'
                    : state.selectedAnswer === index
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-white/5 opacity-50'
                  : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02]'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base">{answer}</span>
                {state.showFeedback && (
                  index === question.correctAnswer ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  ) : state.selectedAnswer === index ? (
                    <XIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  ) : null
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const correctAnswers = state.answers.filter(a => a).length;
    const totalQuestions = QUESTIONS_PER_GAME[state.difficulty];
    const percentage = (correctAnswers / totalQuestions) * 100;
    const tokens = Math.round(correctAnswers * difficultySettings[state.difficulty].tokenBase * state.multiplier);
    const newHighScore = Math.max(state.highScore, correctAnswers);
    const isNewHighScore = newHighScore > state.highScore;

    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="flex items-center justify-center w-20 h-20 mb-6 sm:w-24 sm:h-24 sm:mb-8 rounded-full bg-blue-500/20">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
        </div>

        <h2 className="mb-1 text-xl sm:text-3xl font-bold sm:mb-2">Quiz Complete!</h2>
        <p className="mb-6 text-sm sm:text-base sm:mb-8 text-white/60">Great job! Here's how you did:</p>

        <div className="grid grid-cols-2 gap-6 mb-8 sm:gap-8 sm:mb-12">
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold sm:text-4xl sm:mb-2">{percentage.toFixed(0)}%</div>
            <div className="text-xs sm:text-sm text-white/60">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-yellow-400 sm:text-4xl sm:mb-2">
              {tokens}
              {isNewHighScore && <span className="ml-2 text-sm">🏆</span>}
            </div>
            <div className="text-xs sm:text-sm text-white/60">Tokens Earned</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={() => setState(prev => ({ ...prev, screen: 'menu' }))}
            className="px-4 py-2 text-sm transition-colors sm:px-6 sm:py-3 sm:text-base bg-white/10 hover:bg-white/20 rounded-xl"
          >
            Back to Menu
          </button>
          <button
            onClick={() => setState(prev => ({ ...prev, screen: 'difficulty' }))}
            className="px-4 py-2 text-sm transition-colors sm:px-6 sm:py-3 sm:text-base bg-blue-500 hover:bg-blue-600 rounded-xl"
          >
            Play Again
          </button>
        </div>
      </div>
    );

  };

  return (
    <div className="h-full">
      {state.screen === 'menu' && renderMenu()}
      {state.screen === 'difficulty' && renderDifficultySelect()}
      {state.screen === 'game' && renderGame()}
      {state.screen === 'results' && renderResults()}
    </div>
  );
};