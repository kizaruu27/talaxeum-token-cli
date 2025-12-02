const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const controller = require("./utils/controller");
const { string } = require("yargs");

// CLI setup
yargs(hideBin(process.argv))
  .command(
    "parseEther <value>",
    "Parse value to ether format",
    {
      value: {
        type: "number",
      },
    },
    controller.parseEtherValue
  )
  .command(
    "formatEther <value>",
    "Format ether value",
    {
      value: {
        type: "number",
      },
    },
    controller.formatEtherValue
  )
  .command("generateTGETime", "Generate TGE Time value", {}, controller.generateTGETime)
  .command("generateTuple", "Generate tuple data", {}, controller.generateTuple)
  .command("setTGETime", "set TGE time for vesting", {}, controller.setTGETime)
  .command(
    "getAllVestingWallets",
    "Get all vesting wallets",
    {},
    controller.getAllVestingWallets
  )
  .command(
    "addAllowedAddress",
    "Add allowed address to talax token",
    {},
    controller.addAllowedAddress
  )
  .command(
    "createVestingScheduleBatch",
    "Create vesting schedule from array",
    {},
    controller.createVestingScheduleBatch
  )
  .command(
    "getAllVestingData",
    "Get all vesting schedule data",
    {},
    controller.getAllVestingData
  )
  .command(
    "transferToken <amount>",
    "transfer amount of tokens to smart contract",
    {
      amount: {
        type: "number",
      },
    },
    controller.transferToken
  )
  .command(
    "checkTokenBalance <address>",
    "Check talax balance on address",
    {
      address: {
        type: "string",
      },
    },
    controller.checkTokenBalance
  )
  .command(
    "getCategoryConfig <category>",
    "Get all category config data",
    {
      category: {
        type: "number",
      },
    },
    controller.getCategoryConfig
  )
  .command(
    "getAllCategoryConfig",
    "Get all category configs",
    {},
    controller.getAllCategoryConfig
  )
  .command(
    "transferAllocationVestingWalletByCategory <category>",
    "Transfer allocation by category",
    {
      category: {
        type: "number",
      },
    },
    controller.transferAllocationVestingWalletByCategory
  )
  .command(
    "createVestingSchedule <beneficiary> <category> <collectionAmount>",
    "Create new vesting schedule",
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
    controller.createVestingSchedule
  )
  .command(
    "restartVestingSchedule <beneficiary> <category> <collectionAmount>",
    "Create new vesting schedule",
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
    controller.restartVestingSchedule
  )
  .command(
    "getVestingSchedule <beneficiary> <category>",
    "Get benefciary vesting schedule",
    {
      beneficiary: {
        type: "string",
      },
      category: {
        type: "number",
      },
    },
    controller.getVestingSchedule
  )
  .command(
    "claimToken <category> <vestingMonth> <signer>",
    "Claim token for beneficiary",
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
    controller.claimToken
  )
  .command(
    "revokeVestingSchedule <beneficiary> <category> <vestingMonth>",
    "Revoke vesting schedule based on vesting month and category",
    {
      beneficiary: {
        type: "string",
      },
      category: {
        type: "number",
      },
      vestingMonth: {
        type: "number",
      },
    },
    controller.revokeVestingSchedule
  )
  .command(
    "unRevokeVestingSchedule <beneficiary> <category> <vestingMonth>",
    "Un-revoke vesting schedule based on vesting month and category",
    {
      beneficiary: {
        type: "string",
      },
      category: {
        type: "number",
      },
      vestingMonth: {
        type: "number",
      },
    },
    controller.unRevokeVestingSchedule
  )
  .command(
    "getClaimableToken <category> <signer>",
    "Get calculated claimable tokens",
    {
      category: {
        type: "number",
      },
      signer: {
        type: "string",
      },
    },
    controller.getClaimableToken
  )
  .command(
    "getLockedToken <category> <signer>",
    "Get calculated claimable tokens",
    {
      category: {
        type: "number",
      },
      signer: {
        type: "string",
      },
    },
    controller.getLockedToken
  )
  .command(
    "transferAllocation <category>",
    "Transfer allocation to vesting wallet",
    {
      category: {
        type: "number",
      },
    },
    controller.transferAllocation
  )
  .command(
    "transferTokenToContract <category> <isTGE>",
    "Transfer allocation to vesting smart contract",
    {
      category: {
        type: "number",
      },
      isTGE: {
        type: "boolean",
      },
    },
    controller.transferTokenToContract
  )
  .command(
    "setVestingWallet <category>",
    "Set vesting wallet address",
    {
      category: {
        type: "number",
      },
    },
    controller.setVestingWallet
  )
  .command(
    "transferAllocationWallet",
    "Transfer wallet allocation",
    {},
    controller.transferAllocationWallet
  )
  .command(
    "getVestingWallet <category>",
    "Get vesting wallet by category",
    {
      category: {
        type: "number",
      },
    },
    controller.getVestingWallet
  )
  .demandCommand(1, "You need to provide a command")
  .help().argv;
