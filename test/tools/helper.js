const {deployments} = require('hardhat');

exports.setTestContracts = deployments.createFixture(
    async ({deployments, getNamedAccounts, ethers}) => {
        await deployments.fixture('main');
        const {holderUSDC, USDC,  holderMatic} = await getNamedAccounts();

        const Strategy = await deployments.get('Strategy');
        const strategy = await ethers.getContractAt('Strategy', Strategy.address, holderMatic);

        const Vault = await deployments.get('Vault');

        const vault = await ethers.getContractAt(
            'Vault', Vault.address, holderUSDC);

        const usdc = await ethers.getContractAt('MockERC20', USDC, holderUSDC);

        return {
            vault,
            usdc,
            holderUSDC,
            strategy,
        };
    }
);
