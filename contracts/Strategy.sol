//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import {AddressAndTickers as Constant} from './helpers/AddressAndTickers.sol';
import './Vault.sol';
import './interfaces/IAaveLendingPool.sol';

contract Strategy {
    IAaveLendingPool aaveProtocol;

    using SafeERC20 for IERC20;

    struct Token {
        bytes32 ticker;
        IERC20 token;
    }

    mapping(bytes32 => Token) public Coins;

    constructor() {
        Coins[Constant.DAI_TICKER] = Token(Constant.DAI_TICKER, IERC20(Constant.DAI_ADDRESS));
        Coins[Constant.USDC_TICKER] = Token(Constant.USDC_TICKER, IERC20(Constant.USDC_ADDRESS));
        Coins[Constant.USDT_TICKER] = Token(Constant.USDT_TICKER, IERC20(Constant.USDT_ADDRESS));

        aaveProtocol = IAaveLendingPool(Constant.AAVE_LEND_POOL_ADDRESS);
    }

    function depositStablecoins(address sender, uint _daiAmount, uint _usdcAmount, uint _usdtAmount)
        external {
        require(Coins[Constant.DAI_TICKER].token.allowance(msg.sender, address(this)) >= _daiAmount,
                'Insufficent balance of the DAI');
        require(Coins[Constant.USDC_TICKER].token.allowance(msg.sender, address(this)) >= _usdcAmount,
                'Insufficent balance of the USDC');
        require(Coins[Constant.USDT_TICKER].token.allowance(msg.sender, address(this)) >= _usdtAmount,
                'Insufficent balance of the USDT');

        Coins[Constant.DAI_TICKER].token.transferFrom(msg.sender, address(this), _daiAmount);
        Coins[Constant.USDC_TICKER].token.transferFrom(msg.sender, address(this), _usdcAmount);
        Coins[Constant.USDT_TICKER].token.transferFrom(msg.sender, address(this), _usdtAmount);

        Coins[Constant.DAI_TICKER].token.safeApprove(Constant.AAVE_LEND_POOL_ADDRESS, _daiAmount);
        Coins[Constant.USDC_TICKER].token.safeApprove(Constant.AAVE_LEND_POOL_ADDRESS, _usdcAmount);
        Coins[Constant.USDT_TICKER].token.safeApprove(Constant.AAVE_LEND_POOL_ADDRESS, _usdtAmount);

        if(_daiAmount > 0){
            aaveProtocol.deposit(Constant.DAI_ADDRESS, _daiAmount, sender, 0);
        }
        if(_usdcAmount > 0){
            aaveProtocol.deposit(Constant.USDC_ADDRESS, _usdcAmount, sender, 0);
        }
        if(_usdtAmount > 0){
            aaveProtocol.deposit(Constant.USDT_ADDRESS, _usdtAmount, sender, 0);
        }
    }
}
