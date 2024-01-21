// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {

    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256) {
        (,int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(uint256 amountETH, AggregatorV3Interface priceFeed) internal view returns(uint256) {
        uint256 priceETH = getPrice(priceFeed);
        uint256 amountETHinUSD = (priceETH * amountETH) / 1e18;
        return amountETHinUSD;
    }

}