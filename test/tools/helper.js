const {deployments} = require('hardhat');

exports.setTestContracts = deployments.createFixture(
    async ({deployments, getNamedAccounts, ethers}) => {
        await deployments.fixture('main');
        const {MATIC, USDC, holderMATIC, holderUSDC} = await getNamedAccounts();

        const Vault = await deployments.get('Vault');

        const vault = await ethers.getContractAt(
            'Vault', Vault.address, holderUSDC);

        const usdc = await ethers.getContractAt('MockERC20', USDC, holderUSDC);
        const matic = await ethers.getContractAt('MockERC20', MATIC, holderMATIC);

        return {
            vault,
            usdc,
            matic,
            holderUSDC,
            holderMATIC,
            // strategy,
        };
    }
);
