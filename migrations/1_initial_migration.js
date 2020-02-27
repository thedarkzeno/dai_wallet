const Migrations = artifacts.require("Migrations");
const DaiToken = artifacts.require("DaiToken");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DaiToken);
  const token = await DaiToken.deployed();
  //mint tokens
  await token.mint(
    "0xFD1C56c2b355F91798251e9c8A5D6b6FC595149D",
    "1000000000000000000000"
  );
};
