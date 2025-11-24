const { ethers } = require("ethers");
const {
  callViewFunction,
  handleTransaction,
  contract,
  VestingCategory,
  talaxeumContract,
  wallet,
  otherSigner,
} = require("../scripts/contract");
const { vestingWallets } = require("../lib/lib");

const transferToken = async (argv) => {
  try {
    const amount = argv.amount;
    await talaxeumContract.transfer(contract, ethers.parseEther(amount.toString()));
    console.log("Successfully transfer token to smart contact");

    const balance = await talaxeumContract.balanceOf(contract);
    console.log("Current TALAX balance: ", ethers.formatEther(balance));
  } catch (error) {
    console.error(error.message);
  }
};

const transferAllocation = async (argv) => {
  const category = argv.category;

  try {
    const vestingWalletAddress = vestingWallets.filter(
      (wallet) => wallet.id === category
    )[0];

    await talaxeumContract.transfer(
      vestingWalletAddress.wallet,
      ethers.parseEther(vestingWalletAddress.totalAllocation)
    );

    console.log("Successfully transfer allocation to: ", vestingWalletAddress.name);

    const balance = await talaxeumContract.balanceOf(vestingWalletAddress.wallet);
    console.log("Current TALAX balance: ", ethers.formatEther(balance));
  } catch (error) {
    console.error(error.message);
  }
};

const transferTokenToContract = async (argv) => {
  const category = argv.category;
  const isTGE = argv.isTGE;

  try {
    const vestingWalletAddress = vestingWallets.filter(
      (wallet) => wallet.id === category
    )[0];

    const amount = isTGE
      ? ethers.parseEther(vestingWalletAddress.tgeAllocation)
      : ethers.parseEther(vestingWalletAddress.monthlyAllocation);

    const runner = otherSigner(vestingWalletAddress.privateKey);

    await talaxeumContract.connect(runner).directTransfer(contract, amount);
    console.log("Successfully direct transfer to vesting smart contract...");

    const balance = await talaxeumContract.balanceOf(contract);
    console.log("TALAX balance: ", ethers.formatEther(balance));
  } catch (error) {
    console.error(error.message);
  }
};

const generateTGETime = (argv) => {
  const tgeTime = Math.floor(new Date().getTime() / 1000) + 30;
  console.log(tgeTime);
};

const parseEtherValue = async (argv) => {
  const formatedValue = await argv.value;
  const parsedValue = ethers.parseEther(formatedValue.toString());
  console.log(parsedValue);
};

const formatEtherValue = async (argv) => {
  const etherValue = await argv.value;
  const value = BigInt(etherValue);
  const formatedValue = ethers.formatEther(value);

  console.log(formatedValue);
};

const addNewCategoryConfig = async (argv) => {
  try {
    const params = {
      category: argv.category,
      name: argv.name,
      totalAllocation: ethers.parseEther(argv.totalAllocation),
      priceSale: ethers.parseEther(argv.priceSale),
      tgePercent: ethers.parseEther(argv.tgePercent),
      cliffMonth: argv.cliffMonth,
      vestingPeriod: argv.vestingPeriod,
      isActive: argv.isActive,
    };

    await contract.addNewCategoryConfig(
      params.category,
      params.name,
      params.totalAllocation,
      params.priceSale,
      params.tgePercent,
      params.cliffMonth,
      params.vestingPeriod,
      params.isActive
    );

    console.log("New category config added");
  } catch (error) {
    console.error(error.message);
  }
};

const restartVestingSchedule = async (argv) => {
  try {
    const params = {
      beneficiary: argv.beneficiary,
      category: argv.category,
      collectionAmount: ethers.parseEther(argv.collectionAmount),
      newStartDate: argv.newStartDate,
    };

    await contract.restartVestingSchedule(
      params.beneficiary,
      params.category,
      params.collectionAmount,
      params.newStartDate
    );

    console.log("Vesting schedule restarted");
  } catch (error) {
    console.error(error.message);
  }
};

const setTGETime = async (argv) => {
  try {
    const tgeTime = Math.floor(new Date().getTime() / 1000);
    await contract.setTGETime(tgeTime);

    console.log("Successfully add new TGE time");
  } catch (error) {
    console.error(error.message);
  }
};

const getCategoryConfig = async (argv) => {
  try {
    const category = argv.category;
    const categoryConfig = await contract.getCategoryConfig(category);
    console.log("Category name: ", categoryConfig.name);
    console.log("Total allocation: ", ethers.formatEther(categoryConfig.totalAlloction));
    console.log("Price Sale: ", ethers.formatEther(categoryConfig.priceSale));
    console.log("TGE Percent: ", Number(categoryConfig.tgePercent) / 1000);
    console.log("Cliff Month: ", Number(categoryConfig.cliffMonth));
    console.log("Vesting Period: ", Number(categoryConfig.vestingPeriod));
    console.log("Is Active: ", categoryConfig.isActive);
  } catch (error) {
    console.error(error.message);
  }
};

const createVestingSchedule = async (argv) => {
  const beneficiary = argv.beneficiary;
  const category = argv.category;
  const collectionAmount = ethers.parseEther(argv.collectionAmount.toString());

  try {
    await contract.createVestingSchedule(beneficiary, category, collectionAmount);
    console.log("Successfully create new vesting schedule");
  } catch (error) {
    console.error(error.message);
  }
};

const getVestingSchedule = async (argv) => {
  const beneficiary = argv.beneficiary;
  const category = argv.category;

  try {
    const vestingScheduleData = await contract.getVestingSchedule(beneficiary, category);
    console.log("-- Vesting Schedule --");

    for (const schedule of vestingScheduleData) {
      console.log("Category: ", Number(schedule.category));
      console.log("Is TGE: ", schedule.isTGE);
      console.log("Claimble Token: ", ethers.formatEther(schedule.claimableToken));
      console.log("Locked Token: ", ethers.formatEther(schedule.lockedToken));
      console.log(
        "Start date: ",
        new Date(Number(schedule.startDate) * 1000).toDateString()
      );
      console.log("Is Locked: ", schedule.isLocked);
      console.log("Is Claimed: ", schedule.isClaimed);
      console.log("Is Revoked: ", schedule.isRevoked);

      console.log("--------");
    }
  } catch (error) {
    console.error(error.message);
  }
};

const claimToken = async (argv) => {
  try {
    const category = argv.category;
    const vestingMonth = argv.vestingMonth;
    const signer = argv.signer;

    const runner = otherSigner(signer);

    await contract.connect(runner).claimToken(category, vestingMonth);
    console.log("Successfully claim token!");
  } catch (error) {
    console.error(error.message);
  }
};

const checkTokenBalance = async (argv) => {
  try {
    const address = argv.address;
    const balance = await talaxeumContract.balanceOf(address);

    console.log("TALAX balance: ", ethers.formatEther(balance));
  } catch (error) {
    console.error(error.message);
  }
};

const revokeVestingSchedule = async (argv) => {
  try {
    await contract.revokeVestingSchedule(
      argv.beneficiary,
      argv.category,
      argv.vestingMonth
    );
    console.log("Successfully revoke vesting schedule!");
  } catch (error) {
    console.error(error.message);
  }
};

const unRevokeVestingSchedule = async (argv) => {
  try {
    await contract.unRevokeVestingSchedule(
      argv.beneficiary,
      argv.category,
      argv.vestingMonth
    );
    console.log("Successfully un-revoke vesting schedule!");
  } catch (error) {
    console.error(error.message);
  }
};

const getClaimableToken = async (argv) => {
  try {
    const runner = otherSigner(argv.signer);
    const claimableToken = await contract
      .connect(runner)
      .getClaimableToken(argv.category);

    console.log(ethers.formatEther(claimableToken), "TALAX");
  } catch (error) {
    console.error(error.message);
  }
};

const getLockedToken = async (argv) => {
  try {
    const runner = otherSigner(argv.signer);
    const lockedToken = await contract.connect(runner).getLockedToken(argv.category);

    console.log(ethers.formatEther(lockedToken), "TALAX");
  } catch (error) {
    console.error(error.message);
  }
};

function toSingleLine(arr) {
  return (
    "[" +
    arr
      .map((obj) => {
        const tuple = [obj.beneficiary, obj.category, obj.collectionAmount];

        return (
          "[" +
          tuple
            .map((v) => (typeof v === "bigint" ? v.toString() + "n" : JSON.stringify(v)))
            .join(",") +
          "]"
        );
      })
      .join(",") +
    "]"
  );
}

const generateTuple = async (argv) => {
  const vestingInput = [
    {
      beneficiary: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      category: 0,
      collectionAmount: ethers.parseEther(Number(100).toString()),
    },
    {
      beneficiary: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      category: 0,
      collectionAmount: ethers.parseEther(Number(200).toString()),
    },
    {
      beneficiary: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      category: 0,
      collectionAmount: ethers.parseEther(Number(450).toString()),
    },
  ];

  console.log(toSingleLine(vestingInput));
};

const createVestingScheduleBatch = async (argv) => {
  try {
    const vestingInput = [
      {
        beneficiary: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        category: 0,
        collectionAmount: ethers.parseEther("100"),
      },
      {
        beneficiary: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        category: 0,
        collectionAmount: ethers.parseEther("200"),
      },
      {
        beneficiary: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        category: 0,
        collectionAmount: ethers.parseEther("450"),
      },
    ];

    await contract.createVestingScheduleBatch(vestingInput);

    console.log("Batched vesting schedule successfully created");
  } catch (error) {
    console.error(error.message);
  }
};

const getAllVestingData = async (argv) => {
  try {
    const vestingData = await contract.getAllVestingData();
    console.log(vestingData);
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = {
  parseEtherValue,
  formatEtherValue,
  addNewCategoryConfig,
  restartVestingSchedule,
  generateTGETime,
  setTGETime,
  transferToken,
  getCategoryConfig,
  createVestingSchedule,
  getVestingSchedule,
  claimToken,
  checkTokenBalance,
  revokeVestingSchedule,
  unRevokeVestingSchedule,
  getClaimableToken,
  getLockedToken,
  generateTuple,
  createVestingScheduleBatch,
  getAllVestingData,
  transferAllocation,
  transferTokenToContract,
};
