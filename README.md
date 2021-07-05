# ▂▃▄▅▆▇█▓▒░ZunamiLab░▒▓█▇▆▅▄▃▂


### Automate A DeFi Yield Farming Strategy On Polygon And AAVE
##### Hackathon: Grants Round 10 Hackathon
__________________________________________

### The Strategy
1. Bridge funds over to Matic

   * Bridge some Matic to your address (for fees)
   * Bridge your stablecoins (USDT, USDC, DAI)

2. Deposit funds on Matic via Aave

    + Deposit stable coins into the Aave market.
    + DAI and USDC can be used for collateral.
    + USDT cannot be collateralized but earns the highest deposit yield (%3.08+%6.99 in this case).

3. Deposit yield

    + Just by depositing you can earn up to 1.80-3.08% APY in native stable coin (as of June 8th, 2021).
    + You also earn an additional 1.83-6.99% in Matic rewards.
    + So your total APR can be around 4-10% just for depositing.
    + Polygon allocated like 40-50M in rewards for these Aave pools.
    + Without borrowing, you'll earn these rewards in real-time.

4. Earn by borrowing

    + In borrowing markets, the variable borrow APR is the interest YOU have to pay additional to your loan.
    + The Matic % underneath is what Aave will pay YOU just to borrow.
    + for USDT you can earn 7.96% APR in Matic just by borrowing (you have to pay 3.90% APR, however).
    + Don't forget when you deposit as collateral you also earn.
    + For USDT you earn 3.08+6.99%=10.07% APR to deposit as explained above.
    + You pay 3.90% and earn 7.96% APR to borrow, which makes you a 4.06% extra profit.
    + This for USDT only makes it a total APR of 10.07% for depositing and 4.06% for borrowing.
    + You're essentially getting paid a lot of Matic tokens to borrow on top of the deposit.

5. Define Borrow Strategy

    + Let's say you deposit 20k into DAI, 20k into USDC, and 60k into USDT pools.
    + You have 40k as collateral where you can borrow ~20k USDT.
    + You are earning interest on 20k DAI, 20k USDC deposits and have 80k USDT (your original 60K which you deposited and the borrowed 20K).
    + So now you can invest the 20K USDT loan.

6. Deposit Borrowed USDT in CRV for Curve Rewards

    + You can now deposit the 20k USDT into curve's platform and earn 3.71% in USDT + 17.09% APY in Matic! Yes, over 20%+ APY on your loan from CRV + the borrowing interest you're already earning on AAVE.

7. Compound Rewards

    + In DeFi you can claim your rewards at any time. So you can periodically claim your Matic rewards in this strategy.
    + You can either: a) add Matic to the matic pool on AAVE and earn an additional APR on that. b) swap for more stables and repeat the whole thing


### Scheme

![alt text](https://raw.githubusercontent.com/ForceDAO/bounties/main/gitcoin/img/original.png "Scheme")


### Our addresses
+ [Transactions](https://explorer-mumbai.maticvigil.com/address/0x6d1961Cc86caD8875CE95b1395d3e47D52551573/transactions)
+ [Contracts](https://explorer-mumbai.maticvigil.com/address/0xE86EA206789E1c9f2b8E1cA7404dcBeE02bA3A29/contracts)
