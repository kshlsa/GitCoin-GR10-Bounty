const {ethers} = require('hardhat');

const chai = require('chai');
const {solidity} = require('ethereum-waffle');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts} = require('./tools/helper');

describe('Strategy test', () => {
    let vault;
    let dai;
    let usdc;
    let usdt;
    let adai;
    let ausdc;
    let ausdt;
    let holderDAI;
    let holderUSDC;
    let holderUSDT;
    let balanceATokens;
    const amount = 100000;

    beforeEach(async () => {
        const config = await setTestContracts();
        vault = config.vault;
        aToken = config.aToken;
        dai = config.dai;
        usdc = config.usdc;
        usdt = config.usdt;
        adai = config.adai;
        ausdc = config.ausdc;
        ausdt = config.ausdt;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);

        // transfer of tokens to the address holderUSDC
        await dai.connect(holderDAI).transfer(holderUSDC.address, amount);
        await usdt.connect(holderUSDT).transfer(holderUSDC.address, amount);
    });

    it('Strategy receive aDAI', async () => {
        await dai.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(amount, 0, 0);

        balanceATokens = await adai.balanceOf(holderUSDC.address);
        balanceATokens.should.equal(amount.toString());
    });

    it('Strategy receive aUSDC', async () => {
        await usdc.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(0, amount, 0);

        balanceATokens = await ausdc.balanceOf(holderUSDC.address);
        balanceATokens.should.equal(amount.toString());
    });

    it('Strategy receive aUSDT', async () => {
        await usdt.connect(holderUSDC).approve(vault.address, amount);
        await vault.connect(holderUSDC).deposit(0, 0, amount);

        balanceATokens = await ausdt.balanceOf(holderUSDC.address);
        balanceATokens.should.equal(amount.toString());
    });

    it('Strategy receive of three currencies', async () => {
        await dai.connect(holderUSDC).approve(vault.address, amount);
        await usdc.connect(holderUSDC).approve(vault.address, amount);
        await usdt.connect(holderUSDC).approve(vault.address, amount);

        await vault.connect(holderUSDC).deposit(amount, amount, amount);

        const balanceADAI = await adai.balanceOf(holderUSDC.address);
        const balanceAUSDC = await ausdc.balanceOf(holderUSDC.address);
        const balanceAUSDT = await ausdt.balanceOf(holderUSDC.address);

        balanceADAI.should.equal(amount.toString());
        balanceAUSDC.should.equal(amount.toString());
        balanceAUSDT.should.equal(amount.toString());
    });
});
