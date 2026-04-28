const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the ImpactBond contract, passing the deployer's address as the initialOwner
  const ImpactBond = await hre.ethers.getContractFactory("ImpactBond");
  const impactBond = await ImpactBond.deploy(deployer.address);

  await impactBond.waitForDeployment();
  const contractAddress = await impactBond.getAddress();

  console.log("ZCZP ImpactBond Contract deployed to:", contractAddress);
  
  // Auto-update React Frontend
  const fs = require("fs");
  const path = require("path");
  const frontendContextPath = path.join(__dirname, "..", "..", "frontend", "src", "context", "Web3Context.jsx");
  
  try {
    let content = fs.readFileSync(frontendContextPath, "utf8");
    content = content.replace(/const CONTRACT_ADDRESS = ".*";/, `const CONTRACT_ADDRESS = "${contractAddress}";`);
    fs.writeFileSync(frontendContextPath, content);
    console.log("✅ Successfully auto-updated Web3Context.jsx with new Contract Address!");
  } catch (error) {
    console.error("Failed to auto-update Web3Context.jsx:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
