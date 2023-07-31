// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleContract {
    string public message;
    IERC20 public tokenContract;
    uint256 public fee = 2 ether;

    constructor() {
        tokenContract = IERC20(0xcD6a42782d230D7c13A74ddec5dD140e55499Df9);
    }

    function changeMessage(string memory newMessage) public {
        require(
            tokenContract.transferFrom(msg.sender, address(this), fee),
            "Token transfer failed"
        );
        message = newMessage;
    }
}