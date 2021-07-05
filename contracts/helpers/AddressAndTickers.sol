//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


library AddressAndTickers {
    bytes32 constant public DAI_TICKER = 'dai';
    bytes32 constant public USDC_TICKER = 'usdc';
    bytes32 constant public USDT_TICKER = 'usdt';
    bytes32 constant public W_MATIC_TICKER = 'WMATIC';
    bytes32 constant public AM_DAI_TICKER = 'amDAI';
    bytes32 constant public AM_USDC_TICKER = 'amUSDC';
    bytes32 constant public AM_USDT_TICKER = 'amUSDT';
    bytes32 constant public AM_W_MATIC_TICKER = 'amWMATIC';
    bytes32 constant public AM_3CRV_TICKER = 'am3CRV';

    address constant public DAI_ADDRESS = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address constant public USDC_ADDRESS = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address constant public USDT_ADDRESS = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address constant public W_MATIC_ADDRESS = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    address constant public AM_DAI_ADDRESS = 0x27F8D03b3a2196956ED754baDc28D73be8830A6e;
    address constant public AM_USDC_ADDRESS = 0x1a13F4Ca1d028320A707D99520AbFefca3998b7F;
    address constant public AM_USDT_ADDRESS = 0x60D55F02A771d515e077c9C2403a1ef324885CeC;
    address constant public AM_WMATIC_ADDRESS = 0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4;
    address constant public INCENTIVES_CONTROLLER_ADDRESS = 0x357D51124f59836DeD84c8a1730D72B749d8BC23;
    address constant public PROTOCOL_DATA_PROVIDER = 0x7551b5D2763519d4e37e8B81929D336De671d46d;
    address constant public LP_ADDRESS_PROVIDER = 0xd05e3E715d945B59290df0ae8eF85c1BdB684744;
    address constant public CURVE_PROTOCOL = 0x445FE580eF8d70FF569aB36e80c647af338db351;
    address constant public AM_3CRV_ADDRESS = 0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171;
}
