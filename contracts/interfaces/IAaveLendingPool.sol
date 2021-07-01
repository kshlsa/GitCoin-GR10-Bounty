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

    function repay(address _asset,
                   uint256 _amount,
                   uint256 _rateMode,
                   address _onBehalfOf) external returns (uint256 paybackAmount);

    function withdraw(address _asset,
                      uint256 _amount,
                      address _to) external returns (uint256 amountToWithdraw);
}
