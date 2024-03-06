// SPDX-License-Identifier: MIT

// Created By : Blockchain Developer Interns Team 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftCertificate is ERC721, Ownable {
    uint256 public mintPrice = 100000000000000; //0.0001 ether
    uint32 public totalSupply;
    uint32 public maxSupply;
    
    mapping(address => uint32) public mintedWallets;
    mapping(uint256 => string) public tokenURIs; // Mapping token ID ke hash IPFS metadata

    constructor(address initialOwner) payable ERC721('Certificate Mint', 'CERTIFICATE') Ownable(initialOwner){
        maxSupply = 20;
    }

    function setMaxSupply(uint32 maxSupply_) external onlyOwner {
        maxSupply = maxSupply_;
    }

    function mint(string memory _tokenURI) external payable {
        require(mintedWallets[msg.sender] <1 , 'Exceed max per wallet');
        require(msg.value == mintPrice, 'Wrong Value');
        require(maxSupply > totalSupply, 'Sold Out');

        mintedWallets[msg.sender]++;
        totalSupply++;
        uint32 tokenId = totalSupply;
        _safeMint(msg.sender, tokenId);
        tokenURIs[tokenId] = _tokenURI; // Simpan hash IPFS metadata
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return tokenURIs[tokenId];
    }
}
