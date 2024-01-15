// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    uint256 favouriteNumber;
    Person public person = Person({favouriteNumber: 2, name: "Anthony"});

    struct Person {
        uint256 favouriteNumber;
        string name;
    }

    mapping(string => uint256) public nameToFavouriteNumber;

    Person[] public people;

    function store(uint256 _favouriteNumber) public virtual {
        favouriteNumber = _favouriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favouriteNumber;
    }

    function addPerson(uint256 _favouriteNumber, string calldata _name) public {
        people.push(Person(_favouriteNumber, _name));
        nameToFavouriteNumber[_name] = _favouriteNumber;
    }

    function getPeopleArray() public view returns (Person[] memory) {
        return people;
    }
}
