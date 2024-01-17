// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./PriceConverter.sol";

error FundMe__NotOwner();
error FundMe__CallFailed();
error FundMe__NotEnoughSent();

/**
 * @title FundMe
 * @author Oleh325
 * @notice This contract is a demonstration of a sample crowdfunding contract.
 * @dev This implements price feeds as our library.
 */
contract FundMe {
    using PriceConverter for uint256;

    uint256 constant public MINIMUM_USD = 5 * 1e18;
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;
    address public immutable i_owner;
    AggregatorV3Interface public immutable i_priceFeed;

    modifier onlyOwner {
        if(msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This function is used to fund the contract. It will revert if the amount sent is less than the minimum, which is 5 USD.
     */
    function fund() public payable {
        if(msg.value.getConversionRate(i_priceFeed) <= MINIMUM_USD) revert FundMe__NotEnoughSent();
        if(s_addressToAmountFunded[msg.sender] == 0) {
            s_funders.push(msg.sender);
            s_addressToAmountFunded[msg.sender] = msg.value;
        }
        else {
            s_addressToAmountFunded[msg.sender] += msg.value;
        }
    }

    /**
     * @notice This function is used to withdraw all the funds from the contract. It will revert if the caller is not the owner.
     */
    function withdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        if(!callSuccess) revert FundMe__CallFailed();
    }
}