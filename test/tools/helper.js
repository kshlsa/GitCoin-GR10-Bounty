const {deployments, ethers} = require('hardhat');

exports.Ticker = {
    'dai': ethers.utils.formatBytes32String('dai'),
    'usdc': ethers.utils.formatBytes32String('usdc'),
    'usdt': ethers.utils.formatBytes32String('usdt'),
    'curve': ethers.utils.formatBytes32String('am3CRV'),
};

exports.setTestContracts = deployments.createFixture(
    async ({deployments, getNamedAccounts, ethers}) => {
        await deployments.fixture('main');
        const {
            amDAI,
            amUSDC,
            amUSDT,
            am3CRV,
            DAI,
            USDT,
            USDC,
            holderDAI,
            holderUSDC,
            holderUSDT,
        } = await getNamedAccounts();

        const Vault = await deployments.get('Vault');
        const vault = await ethers.getContractAt('Vault', Vault.address);

        const Strategy = await deployments.get('Strategy');
        const strategy = await ethers.getContractAt('Strategy', Strategy.address);

        const dai = await ethers.getContractAt('MockERC20', DAI);
        const usdc = await ethers.getContractAt('MockERC20', USDC);
        const usdt = await ethers.getContractAt('MockERC20', USDT);
        const amDai = await ethers.getContractAt('MockERC20', amDAI);
        const amUsdc = await ethers.getContractAt('MockERC20', amUSDC);
        const amUsdt = await ethers.getContractAt('MockERC20', amUSDT);
        const am3crv = await ethers.getContractAt('MockERC20', am3CRV);

        return {
            vault,
            strategy,
            dai,
            usdc,
            usdt,
            amDai,
            amUsdc,
            amUsdt,
            am3crv,
            holderDAI,
            holderUSDC,
            holderUSDT,
        };
    }
);

exports.advanceNBlock = async () => {
    const minute = 60000;
    const time = Date.now() + minute;
    await ethers.provider.send('evm_setNextBlockTimestamp', [time]);
    await ethers.provider.send('evm_mine');
};
