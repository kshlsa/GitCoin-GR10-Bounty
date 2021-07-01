 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import {AddressAndTickers as Constant} from './helpers/AddressAndTickers.sol';
import './Vault.sol';
import './interfaces/IAaveLendingPool.sol';
import './interfaces/IIncentivesController.sol';
import './interfaces/ILendingPoolAddressesProvider.sol';

contract Strategy {
    IAaveLendingPool lendingPool;
    IIncentivesController contractRewards;
    ILendingPoolAddressesProvider lpAddrProvider;

    using SafeERC20 for IERC20;

    struct Token {
        bytes32 ticker;
        IERC20 token;
    }

    mapping(bytes32 => Token) public Coins;

    constructor() {
        lpAddrProvider = ILendingPoolAddressesProvider(Constant.LP_ADDRESS_PROVIDER);
        address lendigPoolAddress = lpAddrProvider.getLendingPool();

        lendingPool = IAaveLendingPool(lendigPoolAddress);


        Coins[Constant.DAI_TICKER] = Token(Constant.DAI_TICKER, IERC20(Constant.DAI_ADDRESS));
        Coins[Constant.USDC_TICKER] = Token(Constant.USDC_TICKER, IERC20(Constant.USDC_ADDRESS));
        Coins[Constant.USDT_TICKER] = Token(Constant.USDT_TICKER, IERC20(Constant.USDT_ADDRESS));

        Coins[Constant.AM_DAI_TICKER] = Token(Constant.AM_DAI_TICKER, IERC20(Constant.AM_DAI_ADDRESS));
        Coins[Constant.AM_USDC_TICKER] = Token(Constant.AM_USDC_TICKER, IERC20(Constant.AM_USDC_ADDRESS));
        Coins[Constant.AM_USDT_TICKER] = Token(Constant.AM_USDT_TICKER, IERC20(Constant.AM_USDT_ADDRESS));

        contractRewards = IIncentivesController(Constant.INCENTIVES_CONTROLLER_ADDRESS);
    }

    function depositStablecoins(uint _daiAmount, uint _usdcAmount, uint _usdtAmount)
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

        Coins[Constant.DAI_TICKER].token.safeApprove(address(lendingPool), _daiAmount);
        Coins[Constant.USDC_TICKER].token.safeApprove(address(lendingPool), _usdcAmount);
        Coins[Constant.USDT_TICKER].token.safeApprove(address(lendingPool), _usdtAmount);

        if(_daiAmount > 0){
            lendingPool.deposit(Constant.DAI_ADDRESS, _daiAmount, address(this), 0);
        }
        if(_usdcAmount > 0){
            lendingPool.deposit(Constant.USDC_ADDRESS, _usdcAmount, address(this), 0);
        }
        if(_usdtAmount > 0){
            lendingPool.deposit(Constant.USDT_ADDRESS, _usdtAmount, address(this), 0);
        }

        uint usdtAmountBorrow = _getAmountBorrow(_daiAmount, _usdcAmount);

        this.borrowAave(usdtAmountBorrow, 2, 0, address(this));
    }


    function borrowAave(uint _usdtAmount, uint256 _interestRateMode, uint16 _referralCode,
        address _borrower) external {
        lendingPool.borrow(Constant.USDT_ADDRESS,
                               _usdtAmount,
                               _interestRateMode,
                               _referralCode,
                               _borrower);
    }

    function _getAmountBorrow(uint _daiTokenAmount , uint _usdcTokenAmount) internal view returns(uint){
        uint DAIfraction = 1e18;
        uint USDCfraction = 1e6;

        uint USDTfraction = (_daiTokenAmount / DAIfraction + _usdcTokenAmount / USDCfraction) / 2 * USDCfraction;
        return USDTfraction;
    }

    function showRewardsBalance(address[] calldata _coins, address _sender) external view returns(uint){
        return contractRewards.getRewardsBalance(_coins, _sender);
    }
}

