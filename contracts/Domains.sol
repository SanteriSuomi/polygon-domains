// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.16;

import "hardhat/console.sol";

contract Domains {
    struct Domain {
        address owner;
        string data;
    }

    mapping(string => Domain) domains;

    function register(string calldata domainName, string calldata data)
        external
    {
        require(
            !isRegistered(domainName),
            "Domain has already been registered"
        );
        domains[domainName] = Domain(msg.sender, data);
    }

    function modifyData(string calldata domainName, string calldata data)
        external
    {
        require(isRegistered(domainName), "Domain has not been registered");
        require(isDomainOwner(domainName), "Sender does not own this domain");
        domains[domainName].data = data;
    }

    function getDomainInfo(string calldata domainName)
        external
        view
        returns (Domain memory)
    {
        return domains[domainName];
    }

    function isRegistered(string calldata domainName)
        private
        view
        returns (bool)
    {
        return address(0) != domains[domainName].owner;
    }

    function isDomainOwner(string calldata domainName)
        private
        view
        returns (bool)
    {
        return msg.sender == domains[domainName].owner;
    }
}
