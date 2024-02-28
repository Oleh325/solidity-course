// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error DynamicSVGNFT__URIQueryForNonexistentTokenId(uint256 tokenId);

contract DynamicSVGNFT is ERC721 {
    
    uint256 private s_tokenCounter;
    string private i_lowImageURI;
    string private i_highImageURI;

    string private constant BASE64_ENCODED_SVG_PREFIX = "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable i_priceFeed;
    mapping(uint256 => int256)  private s_tokenIdToHighValue;

    // Events

    event CreatedNFT(uint256 tokenId, int256 highValue);

    constructor(
        address priceFeedAddress,
        string memory lowSVG,
        string memory highSVG
    ) ERC721("Dynamic SVG NFT", "DSNFT") {
        s_tokenCounter = 0;
        i_lowImageURI = SVGtoImageURI(lowSVG);
        i_highImageURI = SVGtoImageURI(highSVG);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function SVGtoImageURI(string memory svg) public pure returns (string memory) {
        string memory base64EncodedSVG = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(BASE64_ENCODED_SVG_PREFIX, base64EncodedSVG));
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) {
            revert DynamicSVGNFT__URIQueryForNonexistentTokenId(tokenId);
        }
        string memory imageURI = i_lowImageURI;
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        if (price >= s_tokenIdToHighValue[tokenId]) {
            imageURI = i_highImageURI;
        }

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": "100"}], "image": "',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function mintNFT(int256 highValue) public {
        s_tokenIdToHighValue[s_tokenCounter] = highValue;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        emit CreatedNFT(s_tokenCounter, highValue);
    }

    // Getters

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getHighValue(uint256 tokenId) public view returns (int256) {
        return s_tokenIdToHighValue[tokenId];
    }

    function getLowSVGURI() public view returns (string memory) {
        return i_lowImageURI;
    }

    function getHighSVGURI() public view returns (string memory) {
        return i_highImageURI;
    }

    function getPriceFeedAddress() public view returns (address) {
        return address(i_priceFeed);
    }
}
