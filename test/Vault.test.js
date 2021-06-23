const {ethers} = require('hardhat');

const chai = require('chai');
const {solidity} = require('ethereum-waffle');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts, Ticker} = require('./tools/helper');

describe('Vault test', () => {
    let vault;
    let aToken;
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
        aToken = config.aToken;
        dai = config.dai;
        usdc = config.usdc;
        usdt = config.usdt;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);

        await dai.connect(holderDAI).transfer(holderUSDC.address, amount);
        await usdt.connect(holderUSDT).transfer(holderUSDC.address, amount);
    });

    it('Voult deposit dai', async () => {

        balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'before');

        await dai.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(amount, 0, 0);

        balance = await vault.depositerBalances(holderUSDC.address, Ticker.dai);
        balance.should.equal(amount.toString());

        balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'after');
    });

    it('Voult deposit usdc', async () => {
         balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'before');

        await usdc.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(0, amount, 0);

        balance = await vault.depositerBalances(holderUSDC.address, Ticker.usdc);
        balance.should.equal(amount.toString());

         balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'after');
    });

    it('Voult deposit usdt', async () => {
        balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'before');

        await usdt.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(0, 0, amount);

        balance = await vault.depositerBalances(holderUSDC.address, Ticker.usdt);
        balance.should.equal(amount.toString());

         balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'after');
    });

    it('Voult deposit of three currencies', async () => {
         balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'before');

        await dai.connect(holderUSDC).approve(vault.address, amount);
        await usdc.connect(holderUSDC).approve(vault.address, amount);
        await usdt.connect(holderUSDC).approve(vault.address, amount);

        await vault.connect(holderUSDC).deposit(amount, amount, amount);

        const balanceDAI = await vault.depositerBalances(holderUSDC.address, Ticker.dai);
        const balanceUSDC = await vault.depositerBalances(holderUSDC.address, Ticker.usdc);
        const balanceUSDT = await vault.depositerBalances(holderUSDC.address, Ticker.usdt);

        balanceDAI.should.equal(amount.toString());
        balanceUSDC.should.equal(amount.toString());
        balanceUSDT.should.equal(amount.toString());

         balance = await aToken.balanceOf(holderUSDC.address);
        console.log(balance.toString(), 'after');
    });

    it('Voult deposit error insufficient funds', async () => {
        await vault.connect(holderUSDC).deposit(amount, amount, amount)
            .should.be.rejectedWith('insufficient funds');
    });

    // it('Voult withdraw dai', async () => {
    //     await dai.connect(holderUSDC).approve(vault.address, amount);
    //     await vault.connect(holderUSDC).deposit(amount, 0, 0);
    //     await vault.connect(holderUSDC).withdraw(amount, 0, 0);

    //     balance = await vault.depositerBalances(holderUSDC.address, Ticker.dai);
    //     balance.should.equal('0');
    // });


    // it('Voult withdraw usdc', async () => {
    //     await usdc.connect(holderUSDC).approve(vault.address, amount);
    //     await vault.connect(holderUSDC).deposit(0, amount, 0);
    //     await vault.connect(holderUSDC).withdraw(0, amount, 0);

    //     balance = await vault.depositerBalances(holderUSDC.address, Ticker.usdc);
    //     balance.should.equal('0');
    // });

    // it('Voult withdraw usdt', async () => {
    //     await usdt.connect(holderUSDC).approve(vault.address, amount);
    //     await vault.connect(holderUSDC).deposit(0, 0, amount);
    //     await vault.connect(holderUSDC).withdraw(0, 0, amount);

    //     balance = await vault.depositerBalances(holderUSDC.address, Ticker.usdt);
    //     balance.should.equal('0');
    // });

    // it('Voult withdraw of three currencies', async () => {
    //     await dai.connect(holderUSDC).approve(vault.address, amount);
    //     await usdc.connect(holderUSDC).approve(vault.address, amount);
    //     await usdt.connect(holderUSDC).approve(vault.address, amount);

    //     await vault.connect(holderUSDC).deposit(amount, amount, amount);
    //     await vault.connect(holderUSDC).withdraw(amount, amount, amount);

    //     const balanceDAI = await vault.depositerBalances(holderUSDC.address, Ticker.dai);
    //     const balanceUSDC = await vault.depositerBalances(holderUSDC.address, Ticker.usdc);
    //     const balanceUSDT = await vault.depositerBalances(holderUSDC.address, Ticker.usdt);

    //     balanceDAI.should.equal('0');
    //     balanceUSDC.should.equal('0');
    //     balanceUSDT.should.equal('0');
    // });

    it('Voult withdraw error insufficient funds', async () => {
        await vault.connect(holderUSDC).withdraw(amount, amount, amount)
            .should.be.rejectedWith('insufficient funds');
    });
});
