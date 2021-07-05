//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIncentivesController {
    function getRewardsBalance(address[] calldata _assets, address _user)
        external view returns (uint256 balanceRewards);

    function getUserUnclaimedRewards(address _user) external view returns (uint256 unclaimedRewards);

     function claimRewards(address[] calldata _assets,
                           uint256 _amount,
                           address _to) external returns (uint256 amountRewards);
}
