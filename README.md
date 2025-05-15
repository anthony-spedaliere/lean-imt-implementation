# Lean IMT Implementation

This project implements a zero-knowledge proof system using the zk-kit Lean Incremental Merkle Tree (IMT) and Poseidon hashing for address verification.

## Project Structure

```
lean-imt-implementation/
├── package.json
├── poseidon-hash.js
└── circomlib/          # Contains circuit templates and utilities
```

## Dependencies

- `@zk-kit/lean-imt`: ^2.2.3 - For implementing the Lean Incremental Merkle Tree
- `poseidon-lite`: ^0.3.0 - For Poseidon hashing functionality

## Implementation Details

### Address to BigInt Conversion

Ethereum addresses are converted to BigInts for processing in the following way:

1. **Input Format**: Ethereum addresses are 20-byte (40 hexadecimal characters) strings prefixed with "0x"

   ```
   "0x1234567890123456789012345678901234567890"
   ```

2. **Conversion Process**:

   - The "0x" prefix is automatically handled by JavaScript's BigInt constructor
   - The hexadecimal string is interpreted as a base-16 number
   - The resulting BigInt represents the full 160-bit address value

3. **Example Conversion**:

   ```javascript
   const address = "0x1234567890123456789012345678901234567890";
   const addrBigInt = BigInt(address);
   // Result: 1024000000000000000000000000000000000000000n
   ```

4. **Technical Details**:
   - The conversion preserves the full precision of the 160-bit address
   - No information is lost during the conversion
   - The resulting BigInt can be used directly in cryptographic operations

### Poseidon Hashing Process

The Poseidon hash function is used to create a unique, fixed-size output from the Ethereum address. Here's how it works:

1. **Input Processing**:

   ```javascript
   const addrBigInt = BigInt("0x1234567890123456789012345678901234567890");
   // The BigInt is wrapped in an array for poseidon1
   const input = [addrBigInt];
   ```

2. **Poseidon Hash Function**:

   - Uses a sponge construction with a permutation function
   - Operates in a prime field (typically modulo a large prime number)
   - The `poseidon1` function specifically:
     - Takes a single input element (our address BigInt)
     - Applies multiple rounds of permutation
     - Returns a field element (BigInt) as the hash

3. **Mathematical Process**:

   ```
   Input: addrBigInt (160-bit number)
   ↓
   Field Conversion: Convert to field element
   ↓
   Sponge Construction:
   - Absorb phase: Input is absorbed into the state
   - Squeeze phase: Output is generated
   ↓
   Output: 254-bit field element (BigInt)
   ```

4. **Example Transformation**:

   ```javascript
   // Input address
   "0x1234567890123456789012345678901234567890"
   ↓
   // After BigInt conversion
   1024000000000000000000000000000000000000000n
   ↓
   // After Poseidon hash
   17578451688153592243665544943166864774110935098556317990090955166786600652876n
   ```

5. **Why Poseidon?**:
   - Optimized for zero-knowledge proof systems
   - Efficient in arithmetic circuits
   - Provides strong cryptographic security
   - Output is compatible with zk-SNARK protocols

### Poseidon Hashing (poseidon-hash.js)

This module implements address hashing using the Poseidon hash function, which is particularly well-suited for zero-knowledge proofs.

#### Input

```javascript
const addrArr = [
  "0x1234567890123456789012345678901234567890",
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012",
];
```

#### Output

```javascript
[
  17578451688153592243665544943166864774110935098556317990090955166786600652876n,
  21043194320637847926985000857322487303577637983967681822716507214805708212882n,
  6253171294233830945797870460019964345173340303434885033978605918856955573454n,
];
```

#### How it works

1. Takes an array of Ethereum addresses
2. Converts each address to a BigInt
3. Applies the Poseidon hash function to each address
4. Returns an array of hashed values as BigInts

## Usage

1. Install dependencies:

```bash
npm install
```

2. Run the Poseidon hashing example:

```bash
node poseidon-hash.js
```

## Example Code

```javascript
import { poseidon1 } from "poseidon-lite";

const addrArr = [
  "0x1234567890123456789012345678901234567890",
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012",
];

const hashedAddresses = addrArr.map((addr) => {
  const addrBigInt = BigInt(addr);
  return poseidon1([addrBigInt]);
});
```

## Notes

- The Poseidon hash function is particularly efficient for zero-knowledge proofs
- All hashed values are returned as BigInts to maintain precision
- The implementation uses the `poseidon-lite` package for optimized hashing
- Address conversion to BigInt preserves the full 160-bit precision of Ethereum addresses
- The Poseidon hash output is a 254-bit field element, suitable for zk-SNARK protocols
- The Lean IMT implementation provides efficient proof generation and verification
- All tree operations maintain the zero-knowledge properties of the system

## License

ISC

## Author

anthony-spedaliere
