# Blockchain-Based Anonymous Voting System (CP2)

## Overview

This project implements a blockchain-based anonymous voting system using
zero-knowledge proofs (zk-SNARKs). The system allows voters to cast votes
without revealing their identity or vote choice on-chain, while still
ensuring vote validity and preventing double voting.

The system consists of:
- A web frontend (HTML / JavaScript)
- A Node.js backend server
- Zero-knowledge proof generation using ZoKrates
- Smart contracts deployed on a local Ethereum network using Hardhat

This project is implemented and evaluated in a controlled local environment
for academic and experimental purposes.

---

## Directory Structure

voting-dapp/
├── backend/
├── contracts/
├── frontend/
├── scripts/
├── test/
├── zk/
├── hardhat.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md


---

## System Requirements

- Node.js v18 or later
- npm v9 or later
- Hardhat
- ZoKrates
- Linux / macOS / Windows (WSL recommended)

---

## Complete Setup and Execution Guide

The following steps will set up and run the entire project from scratch.
All commands below can be copied and executed sequentially.

```bash
# ===============================
# 1. Install root dependencies
# ===============================
npm install

# ===============================
# 2. Install backend dependencies
# ===============================
cd backend
npm install
cd ..

# ===============================
# 3. Start local Ethereum network
# ===============================
npx hardhat node

Open a new terminal and continue:

# ===============================
# 4. Deploy smart contracts
# ===============================
npx hardhat run scripts/deploy.js --network localhost

# ===============================
# 5. Compile and setup ZoKrates
# ===============================
cd zk
zokrates compile -i voter_eligibility.zok
zokrates setup
cd ..

# ===============================
# 6. Start backend server
# ===============================
cd backend
node server.js

Open a new terminal and continue:

# ===============================
# 7. Launch frontend
# ===============================
# Open the following file in a browser:
# frontend/index.html
