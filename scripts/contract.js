const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load ABI
const abiPath = path.join(__dirname, "../abi/TokenVesting.json");
const abiJson = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

const talaxAbiPath = path.join(__dirname, "../abi/Talaxeum.json");
const talaxAbiJson = JSON.parse(fs.readFileSync(talaxAbiPath, "utf8"));

// Extract ABI array from the JSON
const abi = abiJson.abi;
const talaxAbi = talaxAbiJson.abi;

// Setup wallet provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const otherSigner = (privateKey) => {
  return new ethers.Wallet(privateKey, provider);
};

// Contract address
const contractAddress = process.env.CONTRACT_ADDRESS;
const talaxContractAddress = process.env.TOKEN_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, wallet);
const talaxeumContract = new ethers.Contract(talaxContractAddress, talaxAbi, wallet);

// Vesting Categories Enum
const VestingCategory = {
  PUBLIC_SALES: 0,
  PRIVATE_SALES_STAGE_1_4: 1,
  SEED_SALES: 2,
  STRATEGIC_PARTNER_ADVISORY: 3,
  TEAM_EMPLOYEES_CONTRIBUTORS: 4,
  MARKETING: 5,
  STAKING_REWARD: 6,
  LIQUIDITY_RESERVE: 7,
  DAO_PROJECT_LAUNCHER_POOL: 8,
};

// Handle transaction
// Handle transaction with optional private key
const handleTransaction = async (transaction, args, privateKey = null) => {
  try {
    let walletToUse = wallet;

    // If private key is provided, create a new wallet
    if (privateKey) {
      walletToUse = createWallet(privateKey);
      console.log(`Using custom wallet: ${walletToUse.address}`);
    } else {
      console.log(`Using default wallet: ${wallet.address}`);
    }

    // Connect contract with the wallet
    const contractWithWallet = contract.connect(walletToUse);

    console.log(
      `Executing transaction with args: ${JSON.stringify(args, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )}`
    );

    const tx = await transaction.apply(contractWithWallet, args);
    console.log("Transaction sent: ", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction is confirmed in block: ", receipt.blockNumber);

    return receipt;
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error;
  }
};

// Handle view functions
const callViewFunction = async (functionName, args) => {
  try {
    console.log(
      `Calling view function ${functionName} with args: ${JSON.stringify(args)}`
    );
    const result = await contract[functionName](...args);
    console.log("Result: ", result.toString());
    return result;
  } catch (error) {
    console.error("Error in view function:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

module.exports = {
  contract,
  talaxeumContract,
  VestingCategory,
  handleTransaction,
  callViewFunction,
  wallet,
  otherSigner,
};
