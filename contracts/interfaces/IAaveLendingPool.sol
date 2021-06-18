//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAaveLendingPool {
    function deposit(address asset, uint amount, address onBehalfOf, uint16 referralCode) external;
}
