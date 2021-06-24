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
    let amDai;
    let amUsdc;
    let amUsdt;
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
        amDai = config.amDai;
        amUsdc = config.amUsdc;
        amUsdt = config.amUsdt;
        holderDAI = await ethers.getSigner(config.holderDAI);
        holderUSDC = await ethers.getSigner(config.holderUSDC);
        holderUSDT = await ethers.getSigner(config.holderUSDT);

        // transfer of tokens to the address holderUSDC
        await dai.connect(holderDAI).transfer(holderUSDC.address, amount);
        await usdt.connect(holderUSDT).transfer(holderUSDC.address, amount);
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

    it('Strategy receive of three currencies', async () => {
        await dai.connect(holderUSDC).approve(vault.address, amount);
        await usdc.connect(holderUSDC).approve(vault.address, amount);
        await usdt.connect(holderUSDC).approve(vault.address, amount);

        await vault.connect(holderUSDC).deposit(amount, amount, amount);

        const balanceAmDAI = await amDai.balanceOf(holderUSDC.address);
        const balanceAmUSDC = await amUsdc.balanceOf(holderUSDC.address);
        const balanceAmUSDT = await amUsdt.balanceOf(holderUSDC.address);

        balanceAmDAI.should.equal(amount.toString());
        balanceAmUSDC.should.equal(amount.toString());
        balanceAmUSDT.should.equal(amount.toString());
    });
});
