const chai = require('chai');
const {solidity} = require('ethereum-waffle');
const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts} = require('./tools/helper');


describe('Vault test', () => {
    let vault;
    let usdc;
    let holderUSDC;
    const amount = 10e6;

    beforeEach(async () => {
        const config = await setTestContracts();
        vault = config.vault;
        usdc = config.usdc;
        holderUSDC = config.holderUSDC;
    });

    it('Voult deposit usdc', async () => {
        // console.log(vault);
        // await usdc.transfer(vault.address, amount);
        // console.log(usdc);
        console.log(await usdc.name());
    });
});
