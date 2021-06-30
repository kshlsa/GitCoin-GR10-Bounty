//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAaveLendingPool {
    function deposit(address _asset,
                     uint _amount,
                     address _onBehalfOf,
                     uint16 _referralCode) external;

    function borrow(address _asset,
                    uint256 _amount,
                    uint256
                    _interestRateMode,
                    uint16 _referralCode,
                    address _onBehalfOf) external;
}
