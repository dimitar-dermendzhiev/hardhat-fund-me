const { assert } = require("chai");
const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe;
          let deployer;
          const sendValue = ethers.utils.parseEther("0.02");
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          it("allows people to fund and withdraw", async function () {
              console.log("Funding ....");
              await fundMe.fund({ value: sendValue });
              console.log("Withdrawing ....");
              await fundMe.withdraw();

              console.log("withdrawn");
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              console.log(`edin balance is: ${endingBalance}`);
              assert.equal(endingBalance.toString(), 0);
          });
      });
