// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FuzailToken
 * @dev Dynamic ERC-20 token supporting custom name, symbol, decimals, and initial supply.
 */
contract FuzailToken is ERC20, Ownable {
    uint8 private immutable _customDecimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address initialOwner_
    ) ERC20(name_, symbol_) Ownable(initialOwner_) {
        _customDecimals = decimals_;
        if (initialSupply_ > 0) {
            _mint(initialOwner_, initialSupply_);
        }
    }

    function decimals() public view virtual override returns (uint8) {
        return _customDecimals;
    }

    /**
     * @dev Allows owner to mint additional tokens if needed.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
