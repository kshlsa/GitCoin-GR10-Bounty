const chai = require('chai');
const {solidity} = require('ethereum-waffle');
chai.use(solidity).use(require('chai-as-promised')).should();

const {setTestContracts} = require('./tools/helper');


describe('Strategy test', () => {
    let strategyContract;
    let usdc;
    let holderUSDC;


    it('test1', async () => {
        const config = await setTestContracts();
        console.log('111111');
        strategyContract = config.strategy;
        let t = await strategyContract.depositStablecoins(1, 2, 3);
    });
});
