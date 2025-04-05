// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract ProductTracker {
    struct Product {
        uint256 productId;
        string name;
      // No need for wei. Just store rupees.
        uint256  manufacturerPrice; // ₹150 stored as 150
        uint256  mrpPrice; // Optional: for future validation

        string qrHash;
        address manufacturer;
    }

    mapping(uint => Product) public products;

    /// Add a new product
    function addProduct(
        uint _productId,
        string memory _name,
        uint _manufacturerPrice,
        uint _mrpPrice,
        string memory _qrHash
    ) public {
        products[_productId] = Product({
            productId: _productId,
            name: _name,
            manufacturerPrice: _manufacturerPrice,
            mrpPrice: _mrpPrice,
            qrHash: _qrHash,
            manufacturer: msg.sender
        });
    }

    /// Get Manufacturer Price
    function getManufacturerPrice(uint _productId) public view returns (uint) {
        return products[_productId].manufacturerPrice;
    }

    /// Get MRP
    function getMRP(uint _productId) public view returns (uint) {
        return products[_productId].mrpPrice;
    }

    /// Get QR Hash
    function getQRHash(uint _productId) public view returns (string memory) {
        return products[_productId].qrHash;
    }

    /// Verify QR hash against expected value
    function verifyQR(uint _productId, string memory scannedHash) public view returns (bool) {
        return keccak256(bytes(products[_productId].qrHash)) == keccak256(bytes(scannedHash));
    }
}
