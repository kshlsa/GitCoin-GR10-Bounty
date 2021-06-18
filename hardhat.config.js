require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');

module.exports = {
    defaultNetwork: 'matic',
    networks: {
        hardhat: {
            chainId: 137,
        },
        matic: {
            url: 'https://rpc-mumbai.maticvigil.com',
            accounts: ['0a4e9c04b03e5bd048c6a8cdccb3fbdd147dbe64a78cf97bf70f4a2d62007182'],
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
            default: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        },
        holderDai: {
            default: '0x5A16552f59ea34E44ec81E58b3817833E9fD5436',
        },
        holderUsdt: {
            default: '0x3567Cafb8Bf2A83bBEa4E79f3591142fb4EBe86d',
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
