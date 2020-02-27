pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract DaiToken is ERC20Mintable {
    string public name;
    string public symbol;
    uint256 public decimals;

    constructor() public{
        name = "Dai stablecoin (DAI)";
        symbol = "DAI";
        decimals = 18;
    }
}
