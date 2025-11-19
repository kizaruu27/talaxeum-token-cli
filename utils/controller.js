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

const VestingCategoryWithAllocation = [
  {
    category: VestingCategory.PUBLIC_SALES,
    totalAllocation: 121312368,
  },
  {
    category: VestingCategory.PRIVATE_SALES_STAGE_1_4,
    totalAllocation: 376338044,
  },
  {
    category: VestingCategory.SEED_SALES,
    totalAllocation: 166335498,
  },
  {
    category: VestingCategory.STRATEGIC_PARTNER_ADVISORY,
    totalAllocation: 0,
  },
  {
    category: VestingCategory.TEAM_EMPLOYEES_CONTRIBUTORS,
    totalAllocation: 0,
  },
  {
    category: VestingCategory.MARKETING,
    totalAllocation: 50400000,
  },
  {
    category: VestingCategory.STAKING_REWARD,
    totalAllocation: 0,
  },
  {
    category: VestingCategory.LIQUIDITY_RESERVE,
    totalAllocation: 84807692,
  },
  {
    category: VestingCategory.DAO_PROJECT_LAUNCHER_POOL,
    totalAllocation: 0,
  },
];

const categoryAllocation = (category) => {
  return VestingCategoryWithAllocation.filter((data) => data.category === category)[0]
    .totalAllocation;
};

const beneficiaryData = [
  {
    account: "0x096baa3e066a231958ae48392d535f1f0b136fc1",
    cardsTotal: 20,
  },
];

const calculateAmount = (category, account) => {
  // 1. Calculate all cards total
  const cardsTotal = beneficiaryData.reduce((prev, curr) => prev + curr.cardsTotal, 0);

  // 2. Hitung jatah dasar
  const totalAllocation = categoryAllocation(category);
  const baseAllocationTotal = (totalAllocation * 70) / 100;
  const addressAllocation = baseAllocationTotal / beneficiaryData.length;

  // 3. Calculate bonus
  const totalCardsBonus = (totalAllocation * 30) / 100;
  const bonusPerCard = totalCardsBonus / cardsTotal;

  // 4. Calculate address bonus
  const beneficiariesWithBonus = beneficiaryData.map((data) => ({
    beneficiary: data.account,
    cardsTotal: data.cardsTotal,
    tokenAllocated: ethers.parseEther(
      `${addressAllocation + data.cardsTotal * bonusPerCard}`
    ),
  }));

  return beneficiariesWithBonus.filter((data) => data.beneficiary === account)[0];
};

const transferToken = async (argv) => {
  try {
    const supply = ethers.parseEther(argv.supply.toString());
    await talaxeumContract.transfer(contract, supply);

    console.log(
      `Successfuly transfer ${ethers.formatEther(
        supply
      )} token to ${await contract.getAddress()}`
    );

    const contractAmount = await talaxeumContract.balanceOf(contract);
    console.log("Current vesting balance: ", ethers.formatEther(contractAmount));
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const setTGETime = async (argv) => {
  try {
    const tgeTime = Math.floor(new Date().getTime() / 1000);

    try {
      await contract.setTGETime(tgeTime);
      console.log("✅ TGE time set successfully");
    } catch (error) {
      console.error("Error: ", error.message);
    }
  } catch (error) {
    console.error("❌ Error setting TGE time:", error.message);
    process.exit(1);
  }
};

const addBeneficiaries = async (argv) => {
  try {
    const addresses = [
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    ];

    // Menggunakan handleTransaction yang sudah disiapkan
    await contract.addBeneficaryAccount(addresses);

    console.log(`✅ Beneficiaries added successfully`);
  } catch (error) {
    console.error("❌ Error adding beneficiaries:", error.message);
    process.exit(1);
  }
};

const getAllBeneficiaries = async (argv) => {
  try {
    const beneficiaries = await contract.getAllBeneficiaries();
    console.log("Beneficiaries data: ");

    for (let i = 0; i < beneficiaries.length; i++) {
      const beneficiary = beneficiaries[i];
      console.log(`${i + 1}. ${beneficiary}`);
    }
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const createVestingScheduleForAll = async (argv) => {
  const vestingInputs = [
    {
      beneficiary: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      category: VestingCategory.PUBLIC_SALES,
      amount: calculateAmount(
        VestingCategory.PUBLIC_SALES,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      ).tokenlocated,
    },
    {
      beneficiary: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      category: VestingCategory.PUBLIC_SALES,
      amount: calculateAmount(
        VestingCategory.PUBLIC_SALES,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
      ).tokenAllocated,
    },
    {
      beneficiary: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      category: VestingCategory.PUBLIC_SALES,
      amount: calculateAmount(
        VestingCategory.PUBLIC_SALES,
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
      ).tokenAllocated,
    },
    {
      beneficiary: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      category: VestingCategory.PUBLIC_SALES,
      amount: calculateAmount(
        VestingCategory.PUBLIC_SALES,
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
      ).tokenAllocated,
    },
  ];

  try {
    await contract.createVestingScheduleForAll(vestingInputs);
    console.log(`✅ Successfully created all vesting schedules`);
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const claimTGE = async (argv) => {
  try {
    const runner = otherSigner(argv.signer);

    const category = argv.category;
    const balanceBefore = await talaxeumContract.balanceOf(runner);
    await contract.connect(runner).releaseTGE(category);
    const balanceAfter = await talaxeumContract.balanceOf(runner);
    const tgeReleased = balanceAfter - balanceBefore;

    console.log("Sucessfully claim TGE");
    console.log("Balance before: ", ethers.formatEther(balanceBefore));
    console.log("TGE Released: ", ethers.formatEther(tgeReleased));
    console.log("Balance after: ", ethers.formatEther(balanceAfter));
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const approveToken = async (amount) => {
  await talaxeumContract.approve(contract, amount);
  console.log("Transaction approved....");
};

const claimVested = async (argv) => {
  try {
    const category = await argv.category;
    const vestingMonth = await argv.vestingMonth;
    const runner = otherSigner(argv.signer);

    const vestingSchedule = await contract.getVestingSchedule(runner, category);
    const claimableToken = vestingSchedule[vestingMonth].claimableToken;
    console.log("Claimable token: ", ethers.formatEther(claimableToken));

    // Approval token
    await approveToken(claimableToken);

    // Claim
    await contract.connect(runner).claimToken(category, vestingMonth);
    console.log("Successfully claim token");
  } catch (error) {
    console.error(error.message);
  }
};

const getClaimableAmount = async (argv) => {
  try {
    const category = argv.category;
    const beneficiary = argv.address;

    const claimableToken = await contract.getReleasableAmount(beneficiary, category);
    console.log("Claimable Token: ", ethers.formatEther(claimableToken));
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const getLockedTokens = async (argv) => {
  try {
    const category = argv.category;
    const signer = otherSigner(argv.signer);

    const lockedTokens = await contract.connect(signer).getLockedTokens(category);
    console.log("Locked tokens: ", ethers.formatEther(lockedTokens));
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const generateBeneficiaryTuple = async (argv) => {
  const accounts = [
    "0xd3a02eF9a529dDa9ED2040b60E17AAfCB0Be5E0F",
    "0x66a2065f266350eeef5604eFf9d2ED57f21A0BbF",
    "0x05e900aC21Bc20C7B2CaC8f63E5B23Bb3b3C5Ec0",
  ];

  const tuple = JSON.stringify(accounts);
  console.log(tuple);
};

const generateSuplyTokenValue = async (argv) => {
  const supply = ethers.parseEther(argv.supply.toString());
  console.log(supply);
};

const generateVestingInputsTuple = async (argv) => {
  const vestingInputs = [
    {
      beneficiary: "0x096baa3e066a231958ae48392d535f1f0b136fc1",
      category: VestingCategory.PUBLIC_SALES,
      amount: calculateAmount(
        VestingCategory.PUBLIC_SALES,
        "0x096baa3e066a231958ae48392d535f1f0b136fc1"
      ).tokenAllocated,
    },
  ];

  const data = vestingInputs.map((input) => [
    input.beneficiary,
    input.category,
    input.amount,
  ]);

  const tuple = data.map(([address, category, obj]) => [
    address,
    category,
    obj.tokenAllocated, // tetap BigInt
  ]);

  function toSingleLine(arr) {
    return (
      "[" +
      arr
        .map(
          (inner) =>
            "[" +
            inner
              .map((v) =>
                typeof v === "bigint" ? v.toString() + "n" : JSON.stringify(v)
              )
              .join(",") +
            "]"
        )
        .join(",") +
      "]"
    );
  }

  // console.log(toSingleLine(tuple));
  console.log(data);
};

// New
const generateDateInt = async (argv) => {
  const tgeTime = Math.floor(new Date().getTime() / 1000);
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

const getVestingScheduleByCategory = async (argv) => {
  const beneficiary = await argv.beneficiary;
  const category = await argv.category;
  const index = await argv.indexMonth;

  try {
    const vestingSchedule = await contract.getVestingSchedule(beneficiary, category);
    const TGEDate = new Date(Number(vestingSchedule[index].startDate) * 1000);

    console.log(ethers.formatEther(vestingSchedule[index].claimableToken));
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const addNewVestingSchedule = async (argv) => {
  const beneficiary = await argv.beneficiary;
  const category = await argv.category;
  const collectionAmount = await argv.collectionAmount;

  try {
    await contract.createVestingSchedule(
      beneficiary,
      category,
      ethers.parseEther(collectionAmount.toString())
    );
    console.log("Successfully add new vesting schedule");
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

const getAllVestingSchedule = async (argv) => {
  try {
    const vestingSchedule = await contract.getAllFunctionSchedule();
    console.log(vestingSchedule);
  } catch (error) {
    console.error(error.message);
  }
};

const getAllVestingData = async (argv) => {
  try {
    const vestingData = await contract.getAllVestingData();
    console.log(vestingData[0]);
  } catch (error) {
    console.error(error.message);
  }
};

const getVestingScheduleByMonth = async (argv) => {
  try {
    const beneficiary = await argv.beneficiary;
    const category = await argv.category;
    const monthAfterCliff = await argv.monthAfterCliff;

    const vestingData = await contract.getVestingScheduleByMonth(
      beneficiary,
      category,
      monthAfterCliff
    );

    console.log(new Date(Number(vestingData.startDate) * 1000).toDateString());
  } catch (error) {
    console.error(error.message);
  }
};

const checkTalaxBalance = async (argv) => {
  try {
    const balance = await contract.getTalaxBalance(argv.wallet);

    console.log(ethers.formatEther(balance), "TALAX");
  } catch (error) {
    console.error(error.message);
  }
};

const addAdminAccount = async (argv) => {
  try {
    const address = await argv.address;
    await contract.addAdminAccount(address);

    console.log(`Successfully add ${address} as admin`);
  } catch (error) {
    console.error(error.message);
  }
};

const getAllAdmins = async (argv) => {
  try {
    const adminsData = await contract.getAllAdmins();
    console.log(adminsData);
  } catch (error) {
    console.error(error.message);
  }
};

const updateCategoryConfig = async (argv) => {
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

    await contract.updateCategoryConfig(
      params.category,
      params.name,
      params.totalAllocation,
      params.priceSale,
      params.tgePercent,
      params.cliffMonth,
      params.vestingPeriod,
      params.isActive
    );

    console.log("Successfully updated category config");
  } catch (error) {
    console.error(error.message);
  }
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

const setVestingWallet = async (argv) => {
  try {
    const wallet = await argv.wallet;
    const category = await argv.category;

    await contract.setVestingWallets(wallet, category);

    console.log(`Successfully add ${wallet} as ${category} wallet`);
  } catch (error) {
    console.error(error.message);
  }
};

const transferAllocationWallet = async (argv) => {
  try {
    const category = await argv.category;
    await contract.transferAllocationWallet(category);
    console.log("Successfully transfer allocation amount to wallet");

    const runner = otherSigner(argv.signer);
    const balance = await talaxeumContract.balanceOf(runner);
    console.log("Talax balance: ", balance);
  } catch (error) {
    console.error(error.message);
  }
};

const getVestingWallet = async (argv) => {
  try {
    const wallet = await contract.getVestingWallet(argv.category);
    console.log(wallet);
  } catch (error) {
    console.error(error.message);
  }
};

const getTokenAllocation = async (argv) => {
  try {
    const category = argv.category;
    const allocation = await contract.getCategoryAllocation(category);

    console.log("Category allocation: ", ethers.formatEther(allocation));
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  transferToken,
  setTGETime,
  addBeneficiaries,
  getAllBeneficiaries,
  createVestingScheduleForAll,
  claimTGE,
  claimVested,
  getClaimableAmount,
  getLockedTokens,
  generateBeneficiaryTuple,
  generateSuplyTokenValue,
  generateVestingInputsTuple,
  parseEtherValue,
  formatEtherValue,
  setVestingWallet,
  addNewVestingSchedule,
  getVestingScheduleByCategory,
  getAllVestingSchedule,
  getAllVestingData,
  getVestingScheduleByMonth,
  checkTalaxBalance,
  addAdminAccount,
  getAllAdmins,
  updateCategoryConfig,
  addNewCategoryConfig,
  generateDateInt,
  restartVestingSchedule,
  transferAllocationWallet,
  getVestingWallet,
  getTokenAllocation,
};
