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
        MATIC: {
            default: '0x0000000000000000000000000000000000001010',
        },
        DAI: {
            default: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        },
        USDC: {
            default: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        },
        USDT: {
            default: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        },
        AaveToken: {
            default: '0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360',
        },
        deployer: {
            default: 0,
        },
        user: {
            default: 0,
        },
        holderUSDC: {
            default: '0x986a2fca9eda0e06fbf7839b89bfc006ee2a23dd',
        },
        holderDAI: {
            default: '0x293Ed38530005620e4B28600f196a97E1125dAAc',
        },
        holderUSDT: {
            default: '0x1CC1C54314c7feC2c3020a40a6cD9D1C4A44ED90',
        },
        holderMatic: {
            default: '0x5e3ef299fddf15eaa0432e6e66473ace8c13d908',
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
