const {ethers} = require('hardhat');

const chai = require('chai');
const {solidity} = require('ethereum-waffle');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts, Ticker} = require('./tools/helper');

describe('Vault test', () => {
    let vault;
    let dai;
    let usdc;
    let usdt;
    let am3crv;
    let holderDAI;
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
        wMatic = config.wMatic;
        amDai = config.amDai;
        amUsdc = config.amUsdc;
        amUsdt = config.amUsdt;
        am3crv = config.am3crv;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);
    });

    it('Voult deposit dai', async () => {
        await dai.connect(holderDAI).approve(vault.address, amountDai);
        await vault.connect(holderDAI).deposit(amountDai, 0, 0);

        balance = await vault.depositerBalances(holderDAI.address, Ticker.dai);
        balance.should.equal(amountDai.toString());
    });

    it('Voult deposit usdc', async () => {
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await vault.connect(holderDAI).deposit(0, amountUsdc, 0);

        balance = await vault.depositerBalances(holderDAI.address, Ticker.usdc);
        balance.should.equal(amountUsdc.toString());
    });

    it('Voult deposit usdt', async () => {
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);
        await vault.connect(holderDAI).deposit(0, 0, amountUsdt);

        balance = await vault.depositerBalances(holderDAI.address, Ticker.usdt);
        balance.should.equal(amountUsdt.toString());
    });

    it('Voult deposit of three currencies', async () => {
        await dai.connect(holderDAI).approve(vault.address, amountDai);
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);

        await vault.connect(holderDAI).deposit(amountDai, amountUsdc, amountUsdt);

        const balanceDAI = await vault.depositerBalances(holderDAI.address, Ticker.dai);
        const balanceUSDC = await vault.depositerBalances(holderDAI.address, Ticker.usdc);
        const balanceUSDT = await vault.depositerBalances(holderDAI.address, Ticker.usdt);

        balanceDAI.should.equal(amountDai.toString());
        balanceUSDC.should.equal(amountUsdc.toString());
        balanceUSDT.should.equal(amountUsdt.toString());
    });

    it('Voult withdrawAll', async () => {
        await dai.connect(holderDAI).approve(vault.address, amountDai);
        await usdc.connect(holderDAI).approve(vault.address, amountUsdc);
        await usdt.connect(holderDAI).approve(vault.address, amountUsdt);

        await vault.connect(holderDAI).deposit(amountDai, amountUsdc, amountUsdt);

        const balanceUsdtBefore = Number(await usdt.balanceOf(holderDAI.address));

        const balanceAm3ctv = await am3crv.balanceOf(holderDAI.address);
        await am3crv.connect(holderDAI).approve(vault.address, balanceAm3ctv);

        await vault.connect(holderDAI).withdrawAll(balanceAm3ctv);

        const balanceUsdtAfter = Number(await usdt.balanceOf(holderDAI.address));

        balanceUsdtAfter.should.satisfy((num) => {
            if (num > balanceUsdtBefore) {
                return true;
            } else {
                return false;
            }
        });
    });

    it('Voult deposit error insufficient funds', async () => {
        await vault.connect(holderDAI).deposit(amountDai, amountUsdc, amountUsdt)
            .should.be.rejectedWith('insufficient funds');
    });
});
