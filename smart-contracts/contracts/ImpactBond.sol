// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ImpactBond
 * @dev ZCZP (Zero Coupon Zero Principal) Bond issued as an NFT for Social Impact Hub.
 */
contract ImpactBond is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Struct to hold bond details permanently on the blockchain
    struct BondDetails {
        string ngoName;
        uint256 amountInvested;
        uint256 timestamp;
    }

    // Mapping from token ID to its bond details
    mapping(uint256 => BondDetails) public bondRecords;

    // Event emitted when a new bond is purchased/minted
    event BondMinted(address indexed investor, uint256 indexed tokenId, string ngoName, uint256 amountInvested);

    constructor(address initialOwner) ERC721("ZCZP Impact Bond", "ZCZP") Ownable(initialOwner) {}

    /**
     * @dev Mints a new ZCZP bond to the investor.
     * @param investor The wallet address of the user buying the bond.
     * @param ngoName The name of the NGO receiving the investment.
     * @param amountInvested The fiat amount invested (tracked off-chain but recorded here).
     */
    function mintBond(address investor, string memory ngoName, uint256 amountInvested) public {
        uint256 tokenId = _nextTokenId++;
        
        // Mint the NFT to the investor
        _safeMint(investor, tokenId);

        // Record the immutable bond details
        bondRecords[tokenId] = BondDetails({
            ngoName: ngoName,
            amountInvested: amountInvested,
            timestamp: block.timestamp
        });

        emit BondMinted(investor, tokenId, ngoName, amountInvested);
    }

    /**
     * @dev Retrieve the bond details for a specific token ID.
     */
    function getBondDetails(uint256 tokenId) public view returns (string memory, uint256, uint256) {
        BondDetails memory b = bondRecords[tokenId];
        return (b.ngoName, b.amountInvested, b.timestamp);
    }
}
