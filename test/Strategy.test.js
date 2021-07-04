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
    let am3crv;
    let holderDAI;
    let holderUSDC;
    let holderUSDT;
    let balanceATokens;
    const amountDai = ethers.utils.parseEther('130', 18);;
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
        am3crv = config.am3crv;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);
    });

    it('Strategy receive amDAI', async () => {
        await dai.connect(holderDAI).approve(vault.address, amountDai);
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);

        await vault.connect(holderDAI).deposit(amountDai, amountUsdc, amountUsdt);

        const balanceATokens = await amDai.balanceOf(strategy.address);
        balanceATokens.should.equal(amountDai.toString());
    });

    it('Strategy receive amUSDC', async () => {
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await vault.connect(holderDAI).deposit(0, amountUsdc, 0);

        balanceATokens = await amUsdc.balanceOf(strategy.address);
        balanceATokens.should.equal(amountUsdc.toString());
    });

    it('Strategy receive amUSDT', async () => {
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);
        await vault.connect(holderDAI).deposit(0, 0, amountUsdt);

        balanceATokens = await amUsdt.balanceOf(strategy.address);
        balanceATokens.should.equal(amountUsdt.toString());
    });

    it('Strategy to show the balance of rewards', async () => {
        await dai.connect(holderDAI).approve(vault.address, amountDai);
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);

        await vault.connect(holderDAI).deposit(amountDai, amountUsdc, amountUsdt);

        const minutes = 60;
        for (let i = 0; i < minutes; i++) {
            await advanceNBlock();
        }

        const rewards = Number(await strategy.showRewardsBalance(
            [amDai.address, amUsdc.address, amUsdt.address],
            strategy.address));


        rewards.should.satisfy((num) => {
            if (num > 0) {
                return true;
            } else {
                return false;
            }
        });
    });

    it('Strategy borrow', async () => {
        //todo: test failure, all usdt tokens went to curve
        await dai.connect(holderDAI).approve(vault.address, amountDai);
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);

        await vault.connect(holderDAI).deposit(amountDai, amountUsdc, amountUsdt);

        const balanceUsdtAfterBorrow = Number(await usdt.balanceOf(strategy.address));

        const DAIfraction = 1e18;
        const USDCfraction = 1e6;
        const USDTfraction = 1e6;

        const ammountBorrowUsdt = (amountDai / DAIfraction + amountUsdc / USDCfraction) / 2 * USDTfraction;

        balanceUsdtAfterBorrow.should.equal(ammountBorrowUsdt);
    });

    it('Strategy receive am3CRV', async () => {
        await dai.connect(holderDAI).approve(vault.address, amountDai);
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);

        const balanceStrategyAm3CRVBefore = Number(await am3crv.balanceOf(strategy.address));

        await vault.connect(holderDAI).deposit(amountDai, amountUsdc, amountUsdt);

        const balanceStrategyAm3CRVAfter = Number(await am3crv.balanceOf(strategy.address));

        balanceStrategyAm3CRVAfter.should.satisfy((num) => {
            if (num > balanceStrategyAm3CRVBefore) {
                return true;
            } else {
                return false;
            }
        });
    });
});
