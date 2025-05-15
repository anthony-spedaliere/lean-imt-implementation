import { poseidon1 } from "poseidon-lite";

// Example array of addresses (you can replace these with your actual addresses)
const addrArr = [
  "0x1234567890123456789012345678901234567890",
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012",
];

// Convert addresses to bigints and hash them
const hashedAddresses = addrArr.map((addr) => {
  // Remove '0x' prefix and convert to BigInt
  const addrBigInt = BigInt(addr);
  // Hash using poseidon1
  return poseidon1([addrBigInt]);
});

console.log("Hashed addresses:", hashedAddresses);
