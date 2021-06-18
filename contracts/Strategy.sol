//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './Vault.sol';
import './interfaces/IAaveLendingPool.sol';

contract Strategy {
    address constant internal usdcAddr = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    bytes32 constant internal usdcTicker = 'usdc';
    address constant internal usdtAddr = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    bytes32 constant internal usdtTicker = 'usdt';
    address constant internal daiAddr = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    bytes32 constant internal daiTicker = 'dai';
    address constant internal aTokenAddr = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    bytes32 constant internal aTokenTicker = 'atoken';

    address constant internal aaveLendingPoollAddr = 0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;
    IAaveLendingPool aaveProtocol;

    using SafeERC20 for IERC20;

    struct Token {
        bytes32 ticker;
        IERC20 token;
    }

    mapping(bytes32 => Token) public Coins;

    constructor() {
        Coins[usdcTicker] = Token(usdcTicker, IERC20(usdcAddr));
        Coins[usdtTicker] = Token(usdtTicker, IERC20(usdtAddr));
        Coins[daiTicker] = Token(daiTicker, IERC20(daiAddr));
        Coins[aTokenTicker] = Token(aTokenTicker, IERC20(aTokenAddr));

        aaveProtocol = IAaveLendingPool(aaveLendingPoollAddr);
    }

    function depositStablecoins(uint _usdcAmount, uint _usdtAmount, uint _daiAmount) external {
        require(Coins[usdcTicker].token.balanceOf(address(this)) >= _usdcAmount,
                'Insufficent balance of the USDC');
        require(Coins[usdtTicker].token.balanceOf(address(this)) >= _usdtAmount,
                'Insufficent balance of the USDT');
        require(Coins[daiTicker].token.balanceOf(address(this)) >= _daiAmount,
                'Insufficent balance of the DAI');

        console.log(Coins[aTokenTicker].token.balanceOf(address(this)), 'Before');

        Coins[usdcTicker].token.safeApprove(aaveLendingPoollAddr, _usdcAmount);
        Coins[usdtTicker].token.safeApprove(aaveLendingPoollAddr, _usdtAmount);
        Coins[daiTicker].token.safeApprove(aaveLendingPoollAddr, _daiAmount);

        aaveProtocol.deposit(usdcAddr, _usdcAmount, msg.sender, 0);
        aaveProtocol.deposit(usdtAddr, _usdtAmount, msg.sender, 0);
        aaveProtocol.deposit(daiAddr, _daiAmount, msg.sender, 0);

        console.log(Coins[aTokenTicker].token.balanceOf(address(this)), 'After');
    }
}
