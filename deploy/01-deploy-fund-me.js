// imports
// main function
// calling the main function

/** 
async function deployFunc(hre) {
    hre.getNamedAccounts;
    hre.deployments;
}
module.exports.default = deployFunc;
*/

/** 
module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
};
*/

const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
// syntactic sugar
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // if chainId is X use address Y
    // if chainId is Z use address A

    let ethUsdPriceFeedAddress;
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    // if contract doesn't exist we deploy a minimal version of it for our local testing

    // when we want to use localhost or hardhat network we want to use a mock
    // mocking is basically creating an object that simulates the behaviour of real object
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
