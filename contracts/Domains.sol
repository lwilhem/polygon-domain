// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import { StringUtils } from "./libraries/StringUtils.sol";

import "hardhat/console.sol";

contract Domains is ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;


  address payable public owner;
  string public tld;

  mapping(string => address) public domains;
  mapping(string => string) public records;
  mapping (uint => string) public names;

  error Unauthorized();
  error AlreadyRegistered();
  error InvalidName(string name);

  string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#a)" d="M0 0h270v270H0z"/><defs><filter id="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path transform="translate(20 20)" d="M37.526 20h7.106A2.368 2.368 0 0 1 47 22.368v18.948a2.368 2.368 0 0 1-2.368 2.368h-7.106a2.368 2.368 0 0 1-2.368-2.368V22.368A2.368 2.368 0 0 1 37.526 20Zm-16.579 0h7.106a2.368 2.368 0 0 1 2.368 2.368v40.264A2.369 2.369 0 0 1 28.053 65h-7.106a2.368 2.368 0 0 1-2.368-2.368V22.368A2.369 2.369 0 0 1 20.947 20ZM4.368 20h7.106a2.368 2.368 0 0 1 2.368 2.368v26.053a2.368 2.368 0 0 1-2.368 2.368H4.368A2.369 2.369 0 0 1 2 48.421V22.368A2.369 2.369 0 0 1 4.368 20ZM9.75.313c.597 0 1.169.31 1.591.864.422.554.659 1.305.659 2.089v13.453c0 .522-.158 1.023-.44 1.392-.28.37-.662.576-1.06.576h-6c-.398 0-.78-.207-1.06-.576-.282-.37-.44-.87-.44-1.392V14.75h-.75c-.597 0-1.169-.311-1.591-.865C.237 13.331 0 12.58 0 11.797V7.203C0 6.42.237 5.67.659 5.115c.422-.554.994-.865 1.591-.865H3v-.984c0-.784.237-1.535.659-2.089.422-.553.994-.865 1.591-.865h4.5ZM3 5.563h-.75c-.69 0-1.25.735-1.25 1.64v4.594c0 .905.56 1.64 1.25 1.64H3V5.564Zm8-2.297c0-.906-.56-1.641-1.25-1.641h-4.5c-.69 0-1.25.735-1.25 1.64v.985h7v-.984ZM5 7.53v6.563c0 .174.053.34.146.464a.45.45 0 0 0 .354.192c.133 0 .26-.07.354-.192A.772.772 0 0 0 6 14.094V7.53a.772.772 0 0 0-.146-.464.45.45 0 0 0-.354-.192.45.45 0 0 0-.354.192A.772.772 0 0 0 5 7.53Zm2.5-.656a.45.45 0 0 0-.354.192A.772.772 0 0 0 7 7.53v6.563c0 .174.053.34.146.464a.45.45 0 0 0 .354.192c.133 0 .26-.07.354-.192A.772.772 0 0 0 8 14.094V7.53a.772.772 0 0 0-.146-.464.45.45 0 0 0-.354-.192ZM9 7.53v6.563c0 .174.053.34.146.464a.45.45 0 0 0 .354.192c.133 0 .26-.07.354-.192a.772.772 0 0 0 .146-.464V7.53a.772.772 0 0 0-.146-.464.45.45 0 0 0-.354-.192.45.45 0 0 0-.354.192A.772.772 0 0 0 9 7.53Zm39.895-6.232a.656.656 0 0 0-.228-1.292L43.09.99a.656.656 0 0 0-.526.504l-.25 1.127h-6.657a.656.656 0 0 0-.656.656v3.937a2.625 2.625 0 0 0 2.625 2.625 3.937 3.937 0 0 0 3.284 3.884.69.69 0 0 0-.003.054v3.281h-2.625a.657.657 0 0 0 0 1.313h6.563a.656.656 0 1 0 0-1.313H42.22v-3.281a.69.69 0 0 0-.003-.054A3.938 3.938 0 0 0 45.5 9.84a2.625 2.625 0 0 0 2.625-2.625V3.277a.656.656 0 0 0-.656-.656h-3.812l.092-.415 5.146-.908Zm-6.874 2.635-.292 1.313h-5.416V3.933h5.708Zm4.791 1.313h-3.739l.292-1.313h3.447v1.313Z" fill="#fff"/><defs><linearGradient id="a" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#FDA015"/><stop offset="1" stop-color="#E10DCC" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#b)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = '</text></svg>';

  constructor(string memory _tld) payable ERC721("The MeBar", "TMB") {
    owner = payable(msg.sender);
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }

  function price(string calldata name) public pure returns(uint) {
    uint len = StringUtils.strlen(name);
    require(len > 0);
    if (len == 3) {
      return 5 * 10**17;
    } else if (len == 4) {
      return 3 * 10**17;
    } else {
      return 1 * 10**17;
    }
  }

  function register(string calldata name) public payable {
    if (domains[name] != address(0)) revert AlreadyRegistered();
    if (!valid(name)) revert InvalidName(name);

    uint256 _price = price(name);
    require(msg.value >= _price, "Not enough Matic paid");
    
    string memory _name = string(abi.encodePacked(name, ".", tld));
    string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
    uint256 newRecordId = _tokenIds.current();
    uint256 length = StringUtils.strlen(name);
    string memory strLen = Strings.toString(length);

    console.log("Registering %s.%s on the contract with tokenID %d", name, tld, newRecordId);

    string memory json = Base64.encode((
      abi.encodePacked(
        '{"name": "',
         _name,
         '", "description": "Welcome to the Club !", "image": "data:image/svg+xml;base64,',
         Base64.encode(bytes(finalSvg)),
         '","length":"',
         strLen,
         '"}'
      )
    ));

    string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));

    _safeMint(msg.sender, newRecordId);
    _setTokenURI(newRecordId, finalTokenUri);
    domains[name] = msg.sender;

    names[newRecordId] = name;
    _tokenIds.increment();
  }

  function getAddress(string calldata name) public view returns (address) {
      // Check that the owner is the transaction sender
      return domains[name];
  }

  function setRecord(string calldata name, string calldata record) public {
      // Check that the owner is the transaction sender
      if (msg.sender != domains[name]) revert Unauthorized();
      records[name] = record;
  }

  function getRecord(string calldata name) public view returns(string memory) {
      return records[name];
  }

  function getAllNames() public view returns (string[] memory) {
  string[] memory allNames = new string[](_tokenIds.current());
  for (uint i = 0; i < _tokenIds.current(); i++) {
    allNames[i] = names[i];
  }

  return allNames;
  }

  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  function valid(string calldata name) public pure returns(bool) {
    return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 10;
  }

  function isOwner() public view returns (bool) {
    return msg.sender == owner;
  }

  function withdraw() public onlyOwner {
    uint amount = address(this).balance;
    
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to withdraw Matic");
  }
}