# Dexfin Frontend

Welcome to the **Dexfin Frontend** repository! This project serves as the user interface for the **Dexfin** platform, a decentralized finance (DeFi) cross-chain aggregator powered by AI.

## 🚀 Overview
🔗 **Live URL:** [Dexfin Frontend](https://dexfin-frontend-production.up.railway.app/)

Dexfin aims to revolutionize DeFi by providing seamless, secure, and trustless cross-chain trading experiences. By integrating advanced AI capabilities, Dexfin offers users:

- **Optimized Yield Strategies** – AI-driven optimization for better returns.
- **Efficient Risk Management** – Enhanced security and risk mitigation.
- **Cross-Chain Liquidity Aggregation** – Access to liquidity across multiple blockchain networks.
- **Gas and Slippage Optimization** – Cost-effective and efficient trading.

## 🛠 Tech Stack
The Dexfin Frontend is built using modern web technologies:
- **Vite** – Fast and optimized build tool.
- **React** – Component-based UI library.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **Zustand** – Simple and lightweight state management.
- **Web3 Libraries** – For blockchain interaction.

## 🔧 Getting Started
Follow these steps to set up the Dexfin Frontend locally.

### 1️⃣ Clone the repository:
```sh
 git clone https://github.com/Dexfinex/dexfin-frontend.git
 cd dexfin-frontend
```

### 2️⃣ Install dependencies:
```sh
 npm install
 # or
yarn install
```

### 3️⃣ Configure environment variables:
Create a `.env` file in the root directory and add the necessary variables:
```
VITE_STYTCH_PUBLIC_TOKEN=<stych_public_token>
VITE_STYTCH_PROJECT_ID=<stych_project_id>
VITE_ENV_MODE='development'
```

### 4️⃣ Run the development server:
```sh
 npm run dev
 # or
yarn dev
```

This will start the app locally, and you can access it at `http://localhost:5173` (default Vite port).

## 📦 Build for Production
To build the project for production:
```sh
 npm run build
```
The output files will be in the `dist/` directory, ready for deployment.

## 🚀 Features
✅ **Multi-Chain Support** – Supports multiple blockchains, including Ethereum, Ethereum L2s, and Solana.

✅ **Gasless Transactions** – Leverage account abstraction (ERC-4337) for seamless, gas-free swaps.

✅ **PushProtocol Chat** – Integrated chat system for user communication.

✅ **Embedded Wallet** – Provided by Lit Protocol and ZeroDev SDK for enhanced user experience.

✅ **Secure Wallet Connection** – Supports both EOA wallets and embedded wallets with social login authentication.

✅ **Multi-Chain Support** – Trade across multiple blockchains.

✅ **Gasless Transactions** – Leverage account abstraction (ERC-4337) for gasless swaps.

✅ **AI-Powered Trading** – Machine learning-driven trade optimization.

✅ **Fast & Lightweight** – Built with Vite for superior performance.

## 📜 License
This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

---
Happy BUIDLing! 🚀

