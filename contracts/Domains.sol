// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.16;

import "hardhat/console.sol";

contract Domains {
    struct Domain {
        address owner;
        string data;
    }

    mapping(string => Domain) domains;

    function onlyDomainOwner(string calldata domainName) private view {
        require(
            msg.sender == domains[domainName].owner,
            "Sender is not domain owner"
        );
    }

    function onlyUnregistered(string calldata domainName) private view {
        require(
            address(0) == domains[domainName].owner,
            "Domain is already registered"
        );
    }

    function register(string calldata domainName, string calldata data)
        external
    {
        domains[domainName] = Domain(msg.sender, data);
    }

    function modifyData(string calldata domainName, string calldata data)
        external
    {
        onlyDomainOwner(domainName);
        domains[domainName].data = data;
    }

    function getDomainInfo(string calldata domainName)
        external
        view
        returns (Domain memory)
    {
        return domains[domainName];
    }

    constructor() {
        console.log("Domains.sol test");
    }
}
