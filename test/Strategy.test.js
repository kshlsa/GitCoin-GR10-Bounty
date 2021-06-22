const {ethers} = require('hardhat');

const chai = require('chai');
const {solidity} = require('ethereum-waffle');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts, Ticker} = require('./tools/helper');

describe('Strategy test', () => {
    let strategy;
    let dai;
    let usdc;
    let usdt;
    let holderDAI;
    let holderUSDC;
    let holderUSDT;
    let balance;
    const amount = 10000;

    beforeEach(async () => {
        const config = await setTestContracts();
        strategy = config.strategy;
        dai = config.dai;
        usdc = config.usdc;
        usdt = config.usdt;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);

        await dai.connect(holderDAI).transfer(holderUSDC.address, amount);
        await usdt.connect(holderUSDT).transfer(holderUSDC.address, amount);
    });

    it('Test of USDC deposit', async () => {
        await strategy.depositStablecoins(1, 2, 3);
    });
});
