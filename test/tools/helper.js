const {deployments} = require('hardhat');

exports.setTestContracts = deployments.createFixture(
    async ({deployments, getNamedAccounts, ethers}) => {
        await deployments.fixture('main');
        const {holderMatic} = await getNamedAccounts();

        // const Vault = await deployments.get('Vault');
        const Strategy = await deployments.get('Strategy');
        // const vault = await ethers.getContractAt(
        // 'Vault', Vault.address, holderUSDC);
        //        const strategy = await ethers.getContractAt(
        //    'Strategy', Strategy.address, holderMatic);

        return {
            // vault,
            //strategy,
        };
    }
);
