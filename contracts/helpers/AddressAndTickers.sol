//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


library AddressAndTickers {
    bytes32 constant public DAI_TICKER = 'dai';
    bytes32 constant public USDC_TICKER = 'usdc';
    bytes32 constant public USDT_TICKER = 'usdt';

    address constant public DAI_ADDRESS = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address constant public USDC_ADDRESS = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address constant public USDT_ADDRESS = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address constant public AAVE_LEND_POOL_ADDRESS = 0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;
}
