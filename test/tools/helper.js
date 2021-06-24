const {deployments, ethers} = require('hardhat');

exports.Ticker = {
    'dai': ethers.utils.formatBytes32String('dai'),
    'usdc': ethers.utils.formatBytes32String('usdc'),
    'usdt': ethers.utils.formatBytes32String('usdt'),
    'curve': ethers.utils.formatBytes32String('a3CRV'),
    'yearn': ethers.utils.formatBytes32String('saCRV'),
    'SusdPool': ethers.utils.formatBytes32String('crvPlain3andSUSD'),
    'DusdPool': ethers.utils.formatBytes32String('dusd3CRV'),
    'Invalid_Ticker': ethers.utils.formatBytes32String('Invalid_Ticker'),
};

exports.setTestContracts = deployments.createFixture(
    async ({deployments, getNamedAccounts, ethers}) => {
        await deployments.fixture('main');
        const {
            aDAI,
            aUSDC,
            aUSDT,
            DAI,
            USDT,
            USDC,
            holderDAI,
            holderUSDC,
            holderUSDT,
        } = await getNamedAccounts();

        const Vault = await deployments.get('Vault');
        const vault = await ethers.getContractAt('Vault', Vault.address);


        const dai = await ethers.getContractAt('MockERC20', DAI);
        const usdc = await ethers.getContractAt('MockERC20', USDC);
        const usdt = await ethers.getContractAt('MockERC20', USDT);
        const adai = await ethers.getContractAt('MockERC20', aDAI);
        const ausdc = await ethers.getContractAt('MockERC20', aUSDC);
        const ausdt = await ethers.getContractAt('MockERC20', aUSDT);

        return {
            vault,
            dai,
            usdc,
            usdt,
            adai,
            ausdc,
            ausdt,
            holderDAI,
            holderUSDC,
            holderUSDT,
        };
    }
);

