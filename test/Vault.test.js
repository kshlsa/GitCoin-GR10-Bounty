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
    let holderDAI;
    let holderUSDC;
    let holderUSDT;
    let balance;
    const amount = 100000;

    beforeEach(async () => {
        const config = await setTestContracts();
        vault = config.vault;
        dai = config.dai;
        usdc = config.usdc;
        usdt = config.usdt;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);
    });

    it('Voult deposit dai', async () => {
        await dai.connect(holderDAI).approve(vault.address, amount);
        await vault.connect(holderDAI).deposit(amount, 0, 0);

        balance = await vault.depositerBalances(holderDAI.address, Ticker.dai);
        balance.should.equal(amount.toString());
    });

    it('Voult deposit usdc', async () => {
        await usdc.connect(holderDAI).approve(vault.address, amount);
        await vault.connect(holderDAI).deposit(0, amount, 0);

        balance = await vault.depositerBalances(holderDAI.address, Ticker.usdc);
        balance.should.equal(amount.toString());
    });

    it('Voult deposit usdt', async () => {
        await usdt.connect(holderDAI).approve(vault.address, amount);
        await vault.connect(holderDAI).deposit(0, 0, amount);

        balance = await vault.depositerBalances(holderDAI.address, Ticker.usdt);
        balance.should.equal(amount.toString());
    });

    it('Voult deposit of three currencies', async () => {
        await dai.connect(holderDAI).approve(vault.address, amount);
        await usdc.connect(holderDAI).approve(vault.address, amount);
        await usdt.connect(holderDAI).approve(vault.address, amount);

        await vault.connect(holderDAI).deposit(amount, amount, amount);

        const balanceDAI = await vault.depositerBalances(holderDAI.address, Ticker.dai);
        const balanceUSDC = await vault.depositerBalances(holderDAI.address, Ticker.usdc);
        const balanceUSDT = await vault.depositerBalances(holderDAI.address, Ticker.usdt);

        balanceDAI.should.equal(amount.toString());
        balanceUSDC.should.equal(amount.toString());
        balanceUSDT.should.equal(amount.toString());
    });

    it('Voult deposit error insufficient funds', async () => {
        await vault.connect(holderDAI).deposit(amount, amount, amount)
            .should.be.rejectedWith('insufficient funds');
    });
});
