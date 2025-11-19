const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const controller = require("./utils/controller");
const { string } = require("yargs");

// CLI setup
yargs(hideBin(process.argv))
  .command(
    "setVestingWallet <wallet> <category>",
    "Set vesting wallet to category",
    {
      wallet: {
        type: "string",
      },
      category: {
        type: "number",
      },
    },
    controller.setVestingWallet
  )
  .command(
    "addNewVestingSchedule <beneficiary> <category> <collectionAmount>",
    "Create new vesting schedules",
    {
      beneficiary: {
        type: "string",
      },
      category: {
        type: "number",
      },
      collectionAmount: {
        type: "number",
      },
    },
    controller.addNewVestingSchedule
  )
  .command("setTGETime", "Set vesting TGE time", {}, controller.setTGETime)
  .command(
    "getTokenAllocation <category>",
    "Get total token category value",
    {
      category: {
        type: "number",
      },
    },
    controller.getTokenAllocation
  )
  .command(
    "checkTalaxBalance <wallet>",
    "Check talax token balance",
    {
      wallet: {
        type: "string",
      },
    },
    controller.checkTalaxBalance
  )
  .command(
    "getVestingWallet <category>",
    "Get vesting wallet talaxeum",
    {
      category: {
        type: "number",
      },
    },
    controller.getVestingWallet
  )
  .command(
    "transferAllocationWallet <category> <signer>",
    "Transfer vesting allocation wallet",
    {
      category: {
        type: "number",
      },
      signer: {
        type: "string",
      },
    },
    controller.transferAllocationWallet
  )
  .command(
    "transferToken <supply>",
    "Transfer token to smart contract",
    {
      supply: {
        type: "number",
      },
    },
    controller.transferToken
  )
  .command(
    "getVestingScheduleByCategory <beneficiary> <category> <indexMonth>",
    "Get vesting schedule data",
    {
      beneficiary: {
        type: "string",
      },
      category: {
        type: "number",
      },
      indexMonth: {
        type: "number",
      },
    },
    controller.getVestingScheduleByCategory
  )
  .command(
    "getVestingScheduleByMonth <beneficiary> <category> <monthAfterCliff>",
    "Get vesting schedule data",
    {
      beneficiary: {
        type: "string",
      },
      category: {
        type: "number",
      },
      monthAfterCliff: {
        type: "number",
      },
    },
    controller.getVestingScheduleByMonth
  )
  .command(
    "addAdminAccount <address>",
    "Add admin account",
    {
      address: {
        type: "string",
      },
    },
    controller.addAdminAccount
  )
  .command(
    "getAllFunctionSchedule",
    "Get all vesting schedule",
    {},
    controller.getAllVestingSchedule
  )
  .command("getAllAdmins", "Get all admin accounts", {}, controller.getAllAdmins)
  .command("getAllVestingData", "Get all vesting data", {}, controller.getAllVestingData)
  .command(
    "generateDateInt",
    "Generate big int date format",
    {},
    controller.generateDateInt
  )
  .command(
    "claimToken <category> <vestingMonth> <signer>",
    "Claim token",
    {
      category: {
        type: "number",
      },
      vestingMonth: {
        type: "number",
      },
      signer: {
        type: "string",
      },
    },
    controller.claimVested
  )
  .command(
    "updateCategoryConfig <category> <name> <totalAllocation> <priceSale> <tgePercent> <cliffMonth> <vestingPeriod> <isActive>",
    "Claim token",
    {
      category: {
        type: "number",
      },
      name: {
        type: "string",
      },
      totalAllocation: {
        type: "string",
      },
      priceSale: {
        type: "string",
      },
      tgePercent: {
        type: "string",
      },
      cliffMonth: {
        type: "number",
      },
      vestingPeriod: {
        type: "number",
      },
      isActive: {
        type: "boolean",
      },
    },
    controller.updateCategoryConfig
  )
  .command(
    "addNewCategoryConfig <category> <name> <totalAllocation> <priceSale> <tgePercent> <cliffMonth> <vestingPeriod> <isActive>",
    "Add new category configuration",
    {
      category: {
        type: "number",
      },
      name: {
        type: "string",
      },
      totalAllocation: {
        type: "string",
      },
      priceSale: {
        type: "string",
      },
      tgePercent: {
        type: "string",
      },
      cliffMonth: {
        type: "number",
      },
      vestingPeriod: {
        type: "number",
      },
      isActive: {
        type: "boolean",
      },
    },
    controller.addNewCategoryConfig
  )
  .command(
    "restartVestingSchedule <beneficiary> <category> <collectionAmount> <newStartDate>",
    "Restart a schedule",
    {
      beneficiary: {
        type: "string",
      },
      category: {
        type: "number",
      },
      collectionAmount: {
        type: "string",
      },
      newStartDate: {
        type: "number",
      },
    },
    controller.restartVestingSchedule
  )
  .command(
    "parseEtherValue <value>",
    "Parsing a value to ether format",
    {
      value: {
        type: "number",
      },
    },
    controller.parseEtherValue
  )
  .command(
    "formatEtherValue <value>",
    "Format a ether value",
    {
      value: {
        type: "number",
      },
    },
    controller.formatEtherValue
  )
  .demandCommand(1, "You need to provide a command")
  .help().argv;
