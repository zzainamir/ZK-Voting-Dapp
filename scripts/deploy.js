const hre = require("hardhat");

async function main() {
  console.log("Deploying AnonymousVoting...");

  const Voting = await hre.ethers.getContractFactory("AnonymousVoting");
  const voting = await Voting.deploy();

  await voting.deployed();

  console.log("AnonymousVoting deployed to:", voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});














