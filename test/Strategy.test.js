const {ethers} = require('hardhat');

const chai = require('chai');
const {solidity} = require('ethereum-waffle');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts, advanceNBlock} = require('./tools/helper');

describe('Strategy test', () => {
    let vault;
    let strategy;
    let dai;
    let usdc;
    let usdt;
    let amDai;
    let amUsdc;
    let amUsdt;
    let holderDAI;
    let holderUSDC;
    let holderUSDT;
    let balanceATokens;
    const amountDai = 30e18;
    const amountUsdc = 30e6;
    const amountUsdt = 50e6;

    beforeEach(async () => {
        const config = await setTestContracts();
        vault = config.vault;
        strategy = config.strategy;
        aToken = config.aToken;
        dai = config.dai;
        usdc = config.usdc;
        usdt = config.usdt;
        amDai = config.amDai;
        amUsdc = config.amUsdc;
        amUsdt = config.amUsdt;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);
    });

    it('Strategy receive amDAI', async () => {
        await dai.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(amount, 0, 0);

        balanceATokens = await amDai.balanceOf(holderUSDC.address);
        balanceATokens.should.equal(amount.toString());
    });

    it('Strategy receive amUSDC', async () => {
        await usdc.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(0, amount, 0);

        balanceATokens = await amUsdc.balanceOf(holderUSDC.address);
        balanceATokens.should.equal(amount.toString());
    });

    it('Strategy receive amUSDT', async () => {
        await usdt.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(0, 0, amount);

        balanceATokens = await amUsdt.balanceOf(holderUSDC.address);
        balanceATokens.should.equal(amount.toString());
    });

    it('Strategy to show the balance of rewards', async () => {
        await dai.connect(holderUSDC).approve(vault.address, amount);
        await usdc.connect(holderUSDC).approve(vault.address, amount);
        await usdt.connect(holderUSDC).approve(vault.address, amount);

        await vault.connect(holderUSDC).deposit(amount, amount, amount);

        const minutes = 60;
        for (let i = 0; i < minutes; i++) {
            await advanceNBlock();
        }

        const rewards = Number(await strategy.showRewardsBalance(
            [amDai.address, amUsdc.address, amUsdt.address],
            holderUSDC.address));


        rewards.should.satisfy((num) => {
            if (num > 0) {
                return true;
            } else {
                return false;
            }
        });
    });

    it.only('Strategy borrow', async () => {
        const balanceUsdtBefore = await dai.balanceOf(holderDAI.address);
        const approveUsdt = amountUsdt + amountDai + amountUsdc;
        const sum = ethers.utils.parseEther('130', 18);

        await dai.connect(holderDAI).approve(vault.address, sum);
        await usdc.connect(holderDAI).approve(vault.address, 250e6);
        await usdt.connect(holderDAI).approve(vault.address, 400e6);

        await vault.connect(holderDAI).deposit(sum, 90e6, 90e6);

        const balanceUsdtAfter = await dai.balanceOf(holderDAI.address);

        console.log(balanceUsdtBefore.toString(), balanceUsdtAfter.toString());
    });
});
