require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
const key = require('./key.json').infura;

module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            forking: {
                url: `https://polygon-mainnet.infura.io/v3/${key}`,
            },
        },
    },
    namedAccounts: {
        DAI: {
            default: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        },
        USDC: {
            default: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        },
        USDT: {
            default: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        },
        deployer: {
            default: 0,
        },
        user: {
            default: 0,
        },
        holderUSDC: {
            default: '0x34965ba0ac2451a34a0471f04cca3f990b8dea27',
        },
        holderDai: {
            default: '0x5A16552f59ea34E44ec81E58b3817833E9fD5436',
        },
        holderUsdt: {
            default: '0x3567Cafb8Bf2A83bBEa4E79f3591142fb4EBe86d',
        },
    },
    mocha: {
        timeout: 300000,
    },
    solidity: {
        version: '0.8.0',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
};
