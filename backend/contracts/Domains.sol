// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import {StringUtils} from "./libraries/StringUtils.sol";

import "hardhat/console.sol";

contract Domains is ERC721URIStorage {
    using Counters for Counters.Counter;

    // Top level domain
    string public tld = ".matic";
    // Indicates the upper bound of domain length from which the price doesn't decrease anymore, use one higher than intented, e.g if value is 11, the max paid domain is 10
    uint256 public domainLengthPriceUpperBound = 11;
    // Price units, the number zeroes it has (wei)
    uint256 public priceUnits = 15;

    string private svgStart =
        '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string private svgEnd = "</text></svg>";
    Counters.Counter private _tokenIds;

    struct Domain {
        address owner;
        string data;
    }

    mapping(string => Domain) private domains;
    mapping(uint256 => string) private tokenToDomain;

    constructor() payable ERC721("Polygon Name Service", "PNS") {}

    function register(string calldata domainName, string calldata data)
        external
        payable
    {
        require(
            !isRegistered(domainName),
            "Domain has already been registered"
        );
        require(
            msg.value == getPrice(domainName),
            "Transaction payment does not equal the price of the domain"
        );

        Domain memory domain = Domain(msg.sender, data);
        domains[domainName] = domain;
        uint256 tokenId = _tokenIds.current();
        tokenToDomain[tokenId] = domainName;
        _tokenIds.increment();
        mint(msg.sender, tokenId);
        string memory name = string.concat(domainName, tld);
        string memory svg = string.concat(svgStart, name, svgEnd);
        _setTokenURI(tokenId, getJsonUri(name, svg));
    }

    function modifyData(string calldata domainName, string calldata data)
        external
    {
        require(isRegistered(domainName), "Domain has not been registered");
        require(isDomainOwner(domainName), "Sender does not own this domain");
        domains[domainName].data = data;
    }

    function getDomainData(string calldata domainName)
        external
        view
        returns (Domain memory)
    {
        return domains[domainName];
    }

    // Price ranges from 1 (one letter) to 0.1 (maxPayableDomainLength) to free (longer than maxPayableDomainLength)
    function getPrice(string calldata domainName)
        public
        view
        returns (uint256)
    {
        uint256 domainLength = StringUtils.length(domainName);
        require(domainLength > 0, "Domain is too short");
        uint256 paymentVar = domainLength;
        if (domainLength > domainLengthPriceUpperBound) {
            paymentVar = domainLengthPriceUpperBound;
        }
        return (domainLengthPriceUpperBound - paymentVar) * 10**priceUnits;
    }

    function _afterTokenTransfer(
        address,
        address to,
        uint256 tokenId
    ) internal override {
        domains[tokenToDomain[tokenId]].owner = to;
    }

    function mint(address to, uint256 tokenId) private {
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }

    function isRegistered(string calldata domainName)
        private
        view
        returns (bool)
    {
        return domains[domainName].owner != address(0);
    }

    function isDomainOwner(string calldata domainName)
        private
        view
        returns (bool)
    {
        return msg.sender == domains[domainName].owner;
    }

    function getJsonUri(string memory name, string memory svg)
        private
        pure
        returns (string memory)
    {
        return
            string.concat(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        string.concat(
                            '{"name": "',
                            name,
                            '", "description": "Polygon name service domain", "image": "data:image/svg+xml;base64,',
                            Base64.encode(bytes(svg)),
                            '","length":"',
                            Strings.toString(StringUtils.length(name)),
                            '"}'
                        )
                    )
                )
            );
    }
}
