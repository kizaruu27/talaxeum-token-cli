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
  .demandCommand(1, "You need to provide a command")
  .help().argv;
