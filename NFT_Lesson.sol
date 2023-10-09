// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
//import "hardhat/console.sol"; // Hardhat console log

import "./ERC721A.sol";
import "./Ownable.sol";

contract TokenMaskLabs is ERC721A, Ownable {

    string baseURI;
    string public baseExtension = ".json";
    uint public cost = 0.1 ether;
    uint public maxSupply =100;
    uint public maxMintAmount = 1;
    bool public paused = true;

    constructor(
    )ERC721A('ETH MASKS v4','EM'){
        setBaseURI('https://bafybeid5fds5mdzuzk5gxotlkkcgck7tz4l3flyid54dde33lvprwia6yy.ipfs.nftstorage.link/'); 
    }

    function mint (uint _mintAmount) public payable {
        if(paused) revert("the contract is paused");
        uint supply = totalSupply();
        if(!(_mintAmount > 0)) revert("Please sprecify 1 or more");
        if(_mintAmount > maxMintAmount) revert("max mint amount per session exceeded");
        if(supply + _mintAmount > maxSupply) revert("max NFT limit exceeded");

        if(msg.sender != owner()){
            if(msg.value < cost * _mintAmount) revert("insufficient funds");
        }

        _safeMint(msg.sender, _mintAmount);
    }

    function airdropMint(address[] calldata _airdropAddress, uint[] memory _userMintAmount) public onlyOwner {
        uint supply = totalSupply();

        uint _mintAmount = 0;
        for(uint i=0; i < _userMintAmount.length; i++){
            _mintAmount += _userMintAmount[i];
        }

        if(!(_mintAmount > 0)) revert("please specify 1 or more");
        if(supply + _mintAmount > maxSupply) revert("max NFT limit exceeded");

        for(uint i = 0; i < _airdropAddress.length ; i++){
            _safeMint(_airdropAddress[i],_userMintAmount[i]);
        }
    }

    function tokenURI(uint _tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(ERC721A.tokenURI(_tokenId),baseExtension));

    }
    function setCost(uint _newCost)public onlyOwner{
        cost = _newCost;
    }

    function setBaseURI(string memory _newBaseURI)public onlyOwner{
        baseURI = _newBaseURI;
    }

    function setPause(bool _state)public onlyOwner{
        paused = _state;
    }

    function maxSuply(uint _newMaxSupply) public onlyOwner{
        maxSupply = _newMaxSupply;
    }

     function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
 
    function _startTokenId() internal view virtual override returns(uint) {
        return 1;
    }
 
    function _baseURI() internal view virtual override returns (string memory){
        return baseURI;
    }

}



