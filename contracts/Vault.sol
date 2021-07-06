//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import 'hardhat/console.sol';

import {AddressAndTickers as Constant} from './helpers/AddressAndTickers.sol';
import './interfaces/IStrategy.sol';

contract Vault {

    IStrategy strategy;

    using SafeERC20 for IERC20;

    mapping(address => mapping(bytes32 => uint)) public depositerBalances;

    constructor(address _strategyAddr) {
        strategy = IStrategy(_strategyAddr);
    }

    function deposit(uint _daiAmount, uint _usdcAmount, uint _usdtAmount) payable external {
         require(
            IERC20(Constant.DAI_ADDRESS).allowance(msg.sender, address(this)) >= _daiAmount,
        'insufficient funds');
         require(
            IERC20(Constant.USDC_ADDRESS).allowance(msg.sender, address(this)) >= _usdcAmount,
        'insufficient funds');
         require(
            IERC20(Constant.USDT_ADDRESS).allowance(msg.sender, address(this)) >= _usdtAmount,
        'insufficient funds');

        IERC20(Constant.DAI_ADDRESS).transferFrom(msg.sender, address(this), _daiAmount);
        IERC20(Constant.USDC_ADDRESS).transferFrom(msg.sender, address(this), _usdcAmount);
        IERC20(Constant.USDT_ADDRESS).transferFrom(msg.sender, address(this), _usdtAmount);

        depositerBalances[msg.sender][Constant.DAI_TICKER] += _daiAmount;
        depositerBalances[msg.sender][Constant.USDC_TICKER] += _usdcAmount;
        depositerBalances[msg.sender][Constant.USDT_TICKER] += _usdtAmount;

        IERC20(Constant.DAI_ADDRESS).approve(address(strategy), _daiAmount);
        IERC20(Constant.USDC_ADDRESS).approve(address(strategy), _usdcAmount);
        IERC20(Constant.USDT_ADDRESS).approve(address(strategy), _usdtAmount);

        strategy.depositStablecoins(msg.sender, _daiAmount, _usdcAmount, _usdtAmount);
    }

    function withdrawAll(uint _amountAm3ctv) external {
        require(
            IERC20(Constant.AM_3CRV_ADDRESS).allowance(msg.sender, address(this)) >= _amountAm3ctv,
        'insufficient funds');

        IERC20(Constant.AM_3CRV_ADDRESS).transferFrom(msg.sender, address(this), _amountAm3ctv);
        IERC20(Constant.AM_3CRV_ADDRESS).approve(address(strategy), _amountAm3ctv);


        strategy.withdraw(msg.sender, _amountAm3ctv);
    }
}
