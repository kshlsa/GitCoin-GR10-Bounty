//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IStrategy {
    function depositStablecoins(address _userAddr,
                                uint _usdcAmount,
                                uint _usdtAmount,
                                uint _daiAmount) external;
}
