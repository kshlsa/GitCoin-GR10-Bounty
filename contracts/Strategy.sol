 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import {AddressAndTickers as Constant} from './helpers/AddressAndTickers.sol';
import './Vault.sol';
import './interfaces/IAaveLendingPool.sol';
import './interfaces/IIncentivesController.sol';
import './interfaces/ILendingPoolAddressesProvider.sol';
import './interfaces/ICurve.sol';

contract Strategy {
    IAaveLendingPool lendingPool;
    IIncentivesController contractRewards;
    ILendingPoolAddressesProvider lpAddrProvider;
    ICurveAavePool curveProtocol;

    uint totalAssets;
    mapping(address => mapping(bytes32 => uint)) public userBalances;
    address[] public users;

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

        curveProtocol = ICurveAavePool(Constant.CURVE_PROTOCOL);


        Coins[Constant.DAI_TICKER] = Token(Constant.DAI_TICKER, IERC20(Constant.DAI_ADDRESS));
        Coins[Constant.USDC_TICKER] = Token(Constant.USDC_TICKER, IERC20(Constant.USDC_ADDRESS));
        Coins[Constant.USDT_TICKER] = Token(Constant.USDT_TICKER, IERC20(Constant.USDT_ADDRESS));

        Coins[Constant.AM_DAI_TICKER] = Token(Constant.AM_DAI_TICKER, IERC20(Constant.AM_DAI_ADDRESS));
        Coins[Constant.AM_USDC_TICKER] = Token(Constant.AM_USDC_TICKER, IERC20(Constant.AM_USDC_ADDRESS));
        Coins[Constant.AM_USDT_TICKER] = Token(Constant.AM_USDT_TICKER, IERC20(Constant.AM_USDT_ADDRESS));
        Coins[Constant.AM_3CRV_TICKER] = Token(Constant.AM_3CRV_TICKER, IERC20(Constant.AM_3CRV_ADDRESS));
        Coins[Constant.AM_W_MATIC_TICKER] = Token(Constant.AM_W_MATIC_TICKER, IERC20(Constant.AM_WMATIC_ADDRESS));

        contractRewards = IIncentivesController(Constant.INCENTIVES_CONTROLLER_ADDRESS);
    }

    function depositStablecoins(address _userAddr,
                                uint _daiAmount,
                                uint _usdcAmount,
                                uint _usdtAmount) external {

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
            userBalances[_userAddr][Constant.DAI_TICKER] += _daiAmount;
        }
        if(_usdcAmount > 0){
            lendingPool.deposit(Constant.USDC_ADDRESS, _usdcAmount, address(this), 0);
            userBalances[_userAddr][Constant.USDC_TICKER] += _usdcAmount;
        }
        if(_usdtAmount > 0){
            lendingPool.deposit(Constant.USDT_ADDRESS, _usdtAmount, address(this), 0);
            userBalances[_userAddr][Constant.USDT_TICKER] += _usdtAmount;
        }

        users.push(_userAddr);
        totalAssets += (_daiAmount + _usdcAmount + _usdtAmount);

        uint usdtAmountBorrow = _getAmountBorrow(_daiAmount, _usdcAmount);

        if(usdtAmountBorrow > 0){
            this.borrowAave(usdtAmountBorrow, 2, 0, _userAddr, address(this));
        }

    }


    function borrowAave(uint _usdtAmount,
                        uint256 _interestRateMode,
                        uint16 _referralCode,
                        address _userAddr, address _borrower) external {

        totalAssets += _usdtAmount;
        lendingPool.borrow(Constant.USDT_ADDRESS,
                               _usdtAmount,
                               _interestRateMode,
                               _referralCode,
                               _borrower);
        uint[3] memory coinAmount;
        coinAmount[0] = 0;
        coinAmount[1] = 0;
        coinAmount[2] = _usdtAmount;

        userBalances[_userAddr][Constant.USDT_TICKER] += _usdtAmount;

        this.depositToCurve(_userAddr, coinAmount, _usdtAmount);
    }

    function depositToCurve(address _userAddr, uint[3] calldata _coins, uint _amount) external {
        Coins[Constant.USDT_TICKER].token.safeApprove(Constant.CURVE_PROTOCOL, _amount);

        uint crvAmount = curveProtocol.add_liquidity(_coins, _amount, true);

        Coins[Constant.AM_3CRV_TICKER].token.transfer(_userAddr, crvAmount);
        userBalances[_userAddr][Constant.AM_3CRV_TICKER] += crvAmount;
    }

    function _getAmountBorrow(uint _daiTokenAmount , uint _usdcTokenAmount) internal pure returns(uint){
        uint DAIfraction = 1e18;
        uint USDCfraction = 1e6;
        uint USDTfraction = 1e6;

        return (_daiTokenAmount / DAIfraction + _usdcTokenAmount / USDCfraction) / 2 * USDTfraction;
    }

    function repay(address _asset, uint256 _amount, uint256 _rateMode, address _onBehalfOf) external returns (uint256) {
    }

    function withdraw(address _asset, uint256 _amount,address _to) external returns (uint256){
    }

    function showRewardsBalance(address[] calldata _coins, address _sender) external view returns(uint){
        return contractRewards.getRewardsBalance(_coins, _sender);
    }

    function claimRewards() external {
        address[] memory assets = new address[](3);
        assets[0] = Constant.AM_DAI_ADDRESS;
        assets[1] = Constant.AM_USDC_ADDRESS;
        assets[2] = Constant.AM_USDT_ADDRESS;

        uint rewardsAmount = contractRewards.getRewardsBalance(assets, address(this));
        uint normalizer = 100;
        console.log(rewardsAmount, 'rewardsAmount');

        totalAssets /= normalizer;

        if(rewardsAmount > 0) {
            uint partOfTotalRewards = 0;

            for(uint i = 0; i < users.length; i++) {
                partOfTotalRewards = userBalances[users[i]][Constant.DAI_TICKER] / totalAssets
                                     + userBalances[users[i]][Constant.USDC_TICKER] / totalAssets
                                     + userBalances[users[i]][Constant.USDT_TICKER] / totalAssets;
            console.log(totalAssets, 'totalAssets');
            console.log(partOfTotalRewards, 'partOfTotalRewards');
            console.log(partOfTotalRewards * rewardsAmount / normalizer, 'rewards user');
            console.log(Coins[Constant.AM_W_MATIC_TICKER].token.balanceOf(address(this)));
            Coins[Constant.AM_W_MATIC_TICKER].token.transfer(users[i], partOfTotalRewards * rewardsAmount / normalizer);
            }
        }
    }
}
