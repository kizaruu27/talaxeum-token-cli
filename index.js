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
  .command("setTGETime", "set TGE time for vesting", {}, controller.setTGETime)
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
  .demandCommand(1, "You need to provide a command")
  .help().argv;
