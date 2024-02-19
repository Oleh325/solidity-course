// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error RandomIPFSNFT__RangeOutOfBounds();

contract RandomIPFSNFT is VRFConsumerBaseV2, ERC721 {

    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATION = 3;
    uint32 private constant NUM_WORDS = 1;
    mapping (uint256 => address) private s_requestIdToSender;

    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random Doggie", "RDOG") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    }

    function requestNFT() public returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(i_gasLane, i_subscriptionId, REQUEST_CONFIRMATION, i_callbackGasLimit, NUM_WORDS);
        s_requestIdToSender[requestId] = msg.sender;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address ntfOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        uint256 moddedRNG = randomWords[0] % MAX_CHANCE_VALUE;
        Breed dogBreed = getBreedFromModdedRNG(moddedRNG);
        _safeMint(ntfOwner, newTokenId);


    }

    function getBreedFromModdedRNG(uint256 moddedRNG) public pure returns (Breed) {
        uint256 cumulativeChance = 0;
        uint256[3] memory breedChances = getChanceArray();
        for (uint256 i = 0; i < breedChances.length; i++) {
            cumulativeChance += breedChances[i];
            if (moddedRNG < cumulativeChance) {
                return Breed(i);
            }
        }
        revert RandomIPFSNFT__RangeOutOfBounds();
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [MAX_CHANCE_VALUE / 10, (MAX_CHANCE_VALUE * 3) / 10, MAX_CHANCE_VALUE];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {

    }
}
