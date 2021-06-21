//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract Vault {
    address constant internal daiAddr = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    bytes32 constant internal daiTicker = 'dai';
    address constant internal usdcAddr = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    bytes32 constant internal usdcTicker = 'usdc';
    address constant internal usdtAddr = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    bytes32 constant internal usdtTicker = 'usdt';

    using SafeERC20 for IERC20;

    mapping(address => mapping(bytes32 => uint)) public depositerBalances;

    function deposit(uint _daiAmount, uint _usdcAmount, uint _usdtAmount) payable external {
        _allowance(daiAddr, _daiAmount);
        _allowance(usdcAddr, _usdcAmount);
        _allowance(usdtAddr, _usdtAmount);

        IERC20(daiAddr).transferFrom(msg.sender, address(this), _daiAmount);
        IERC20(usdcAddr).transferFrom(msg.sender, address(this), _usdcAmount);
        IERC20(usdtAddr).transferFrom(msg.sender, address(this), _usdtAmount);

        depositerBalances[msg.sender][daiTicker] += _daiAmount;
        depositerBalances[msg.sender][usdcTicker] += _usdcAmount;
        depositerBalances[msg.sender][usdtTicker] += _usdtAmount;
    }

    function withdraw(uint _daiAmount, uint _usdcAmount, uint _usdtAmount) external {
        _checkBalanceUser(daiTicker, _daiAmount);
        _checkBalanceUser(usdcTicker, _usdcAmount);
        _checkBalanceUser(usdtTicker, _usdtAmount);

        IERC20(daiAddr).transfer(msg.sender, _daiAmount);
        IERC20(usdcAddr).transfer(msg.sender, _usdcAmount);
        IERC20(usdtAddr).transfer(msg.sender, _usdtAmount);

        depositerBalances[msg.sender][daiTicker] -= _daiAmount;
        depositerBalances[msg.sender][usdcTicker] -= _usdcAmount;
        depositerBalances[msg.sender][usdtTicker] -= _usdtAmount;
    }

    function _checkBalanceUser(bytes32 _tokenTicker, uint _amount) internal view {
        require(depositerBalances[msg.sender][_tokenTicker] >= _amount,
        'insufficient funds');
    }

    function _allowance(address _addresToken, uint _amount) internal view {
        require(IERC20(_addresToken).allowance(msg.sender, address(this)) >= _amount,
        'insufficient funds');
    }

}
