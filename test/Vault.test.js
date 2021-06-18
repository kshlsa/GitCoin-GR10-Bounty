const chai = require('chai');
const {solidity} = require('ethereum-waffle');
const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts} = require('./tools/helper');


describe('Vault test', () => {
    let vault;
    let usdc;
    let matic;
    let holderUSDC;
    let holderMATIC;
    const amountUSDC = 10e6;
    const amountMATIC = 100000000000000;

    beforeEach(async () => {
        const config = await setTestContracts();
        vault = config.vault;
        usdc = config.usdc;
        matic = config.matic;
        holderMATIC = config.holderMATIC;
        holderUSDC = config.holderUSDC;
    });

    it('Voult deposit usdc', async () => {
        await matic.transfer(holderUSDC, amountUSDC);
        const balance = await matic.balanceOf(holderUSDC);
        console.log(balance.toString());
    });
});
