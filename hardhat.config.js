require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
// const key = require('./key.json').infura;

module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            forking: {
                url: `https://polygon-mainnet.infura.io/v3/98322cc4a8ca4178b220a006303c8122`,
            },
        },
        matic: {
            url: 'https://polygon-mumbai.infura.io/v3/fcf6ee08de0546aaaf117306d4689175',
            accounts: ['db044b90f63bd3f74bfd4e2d8b6e4ebaee6b609d65cee32d4e1109e87bce6cb5'],
            gas: 2100000,
            gasPrice: 8000000000,
        },
    },
    namedAccounts: {
        MATIC: {
            default: '0x0000000000000000000000000000000000001010',
        },
        amMATIC: {
            default: '0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4',
        },
        amDAI: {
            default: '0x27F8D03b3a2196956ED754baDc28D73be8830A6e',
        },
        amUSDC: {
            default: '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F',
        },
        amUSDT: {
            default: '0x60D55F02A771d515e077c9C2403a1ef324885CeC',
        },
        am3CRV: {
            default: '0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171',
        },
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
        holderDAI: {
            default: '0x6a74d88D6B009a26f801beA483248B0318E3c7aF',
        },
        holderUSDC: {
            default: '0x0D31CB017573b8398b283b068ce7Cf53C3De6d60',
        },
        holderUSDT: {
            default: '0x6a74d88D6B009a26f801beA483248B0318E3c7aF',
        },
    },
    mocha: {
        timeout: 400000,
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
// db044b90f63bd3f74bfd4e2d8b6e4ebaee6b609d65cee32d4e1109e87bce6cb5
